import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import clientPromise from '../lib/mongodb.js';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../lib/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

const DB_NAME = process.env.MONGODB_DB_NAME || 'todo_db';

async function getCollection(name = 'todos') {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(name);
}

function formatTodo(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Tên người dùng không được để trống' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const usersCollection = await getCollection('users');
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    const existingUser = await usersCollection.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ error: 'Email này đã được đăng ký' });
      }
      return res.status(400).json({ error: 'Tên người dùng này đã được sử dụng' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(newUser);
    const createdUser = { _id: result.insertedId, username: cleanUsername, email: cleanEmail };
    const token = generateToken(createdUser);

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      token,
      user: { id: result.insertedId.toString(), username: cleanUsername, email: cleanEmail },
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng ký: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};
    if (!emailOrUsername?.trim() || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Email/Tên đăng nhập và Mật khẩu' });
    }

    const usersCollection = await getCollection('users');
    const input = emailOrUsername.trim().toLowerCase();

    const user = await usersCollection.findOne({
      $or: [{ email: input }, { username: emailOrUsername.trim() }],
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Email/Tên đăng nhập hoặc Mật khẩu không chính xác' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { id: user._id.toString(), username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng nhập: ' + error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    if (!decoded?.userId) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    res.json({
      user: { id: user._id.toString(), username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy thông tin người dùng: ' + error.message });
  }
});

// ---------------- TODOS ROUTES ----------------
app.get('/api/todos', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const collection = await getCollection('todos');
    const todos = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
    res.json(todos.map(formatTodo));
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách công việc từ MongoDB' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const { title, priority = 'medium' } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Tiêu đề công việc không được để trống' });
    }

    const newTodo = {
      title: title.trim(),
      completed: false,
      priority,
      userId,
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection('todos');
    const result = await collection.insertOne(newTodo);

    res.status(201).json({ id: result.insertedId.toString(), ...newTodo });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Lỗi khi thêm công việc mới vào MongoDB' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID không hợp lệ' });

    const { title, completed, priority } = req.body;
    const updateData = { updatedAt: new Date().toISOString() };

    if (typeof title === 'string' && title.trim()) updateData.title = title.trim();
    if (typeof completed === 'boolean') updateData.completed = completed;
    if (priority) updateData.priority = priority;

    const collection = await getCollection('todos');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'Không tìm thấy công việc' });

    res.json(formatTodo(result));
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật công việc' });
  }
});

app.delete('/api/todos/completed', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const collection = await getCollection('todos');
    await collection.deleteMany({ userId, completed: true });
    res.json({ success: true, message: 'Đã xóa tất cả công việc đã hoàn thành' });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Lỗi khi xóa các công việc đã hoàn thành' });
  }
});

app.patch('/api/todos/toggle-all', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const { completed } = req.body;
    if (typeof completed !== 'boolean') return res.status(400).json({ error: 'Trạng thái completed không hợp lệ' });

    const collection = await getCollection('todos');
    await collection.updateMany(
      { userId },
      { $set: { completed, updatedAt: new Date().toISOString() } }
    );

    res.json({ success: true, completed });
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật tất cả công việc' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded?.userId || 'anonymous';

    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'ID không hợp lệ' });

    const collection = await getCollection('todos');
    const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Không tìm thấy công việc để xóa' });

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Lỗi khi xóa công việc' });
  }
});

export default app;
