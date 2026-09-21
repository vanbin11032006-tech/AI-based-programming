import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import clientPromise from '../lib/mongodb.js';

const app = express();

app.use(cors());
app.use(express.json());

const DB_NAME = 'todoApp';
const COLLECTION_NAME = 'todos';

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// Map MongoDB _id to frontend id
function formatTodo(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  };
}

// 1. GET /api/todos - Lấy danh sách công việc
app.get('/api/todos', async (req, res) => {
  try {
    const collection = await getCollection();
    const todos = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(todos.map(formatTodo));
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách công việc từ MongoDB' });
  }
});

// 2. POST /api/todos - Thêm công việc mới
app.post('/api/todos', async (req, res) => {
  try {
    const { title, priority = 'medium' } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề công việc không được để trống' });
    }

    const newTodo = {
      title: title.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection();
    const result = await collection.insertOne(newTodo);

    res.status(201).json({
      id: result.insertedId.toString(),
      ...newTodo,
    });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Lỗi khi thêm công việc mới' });
  }
});

// 3. PUT /api/todos/:id - Cập nhật công việc (Tiêu đề, trạng thái, độ ưu tiên)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const { title, completed, priority } = req.body;
    const updateData = { updatedAt: new Date().toISOString() };

    if (typeof title === 'string' && title.trim()) updateData.title = title.trim();
    if (typeof completed === 'boolean') updateData.completed = completed;
    if (priority) updateData.priority = priority;

    const collection = await getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Không tìm thấy công việc' });
    }

    res.json(formatTodo(result));
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật công việc' });
  }
});

// 4. DELETE /api/todos/completed - Xóa tất cả công việc đã hoàn thành (đưa lên trước :id route)
app.delete('/api/todos/completed', async (req, res) => {
  try {
    const collection = await getCollection();
    await collection.deleteMany({ completed: true });
    res.json({ success: true, message: 'Đã xóa tất cả công việc đã hoàn thành' });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Lỗi khi xóa các công việc đã hoàn thành' });
  }
});

// 5. PATCH /api/todos/toggle-all - Đánh dấu hoàn thành / chưa hoàn thành tất cả
app.patch('/api/todos/toggle-all', async (req, res) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Trạng thái completed không hợp lệ' });
    }

    const collection = await getCollection();
    await collection.updateMany(
      {},
      { $set: { completed, updatedAt: new Date().toISOString() } }
    );

    res.json({ success: true, completed });
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật tất cả công việc' });
  }
});

// 6. DELETE /api/todos/:id - Xóa 1 công việc theo ID
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công việc để xóa' });
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Lỗi khi xóa công việc' });
  }
});

export default app;
