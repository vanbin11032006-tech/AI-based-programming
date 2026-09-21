import clientPromise from '../lib/mongodb.js';
import { verifyToken } from '../lib/auth.js';

const DB_NAME = process.env.MONGODB_DB_NAME || 'todo_db';
const COLLECTION_NAME = 'todos';

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

function formatTodo(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Xác thực token (nếu có)
  const decoded = verifyToken(req);
  const userId = decoded?.userId || 'anonymous';

  try {
    const collection = await getCollection();

    // 1. GET /api/todos - Lấy danh sách công việc của user tương ứng
    if (req.method === 'GET') {
      const todos = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(todos.map(formatTodo));
    }

    // 2. POST /api/todos - Thêm công việc mới gắn với userId
    if (req.method === 'POST') {
      const { title, priority = 'medium' } = req.body || {};
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Tiêu đề công việc không được để trống' });
      }

      const newTodo = {
        title: title.trim(),
        completed: false,
        priority,
        userId,
        createdAt: new Date().toISOString(),
      };

      const result = await collection.insertOne(newTodo);
      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newTodo,
      });
    }

    // 3. PATCH /api/todos - Đánh dấu completed tất cả công việc của user
    if (req.method === 'PATCH') {
      const { completed } = req.body || {};
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Trạng thái completed không hợp lệ' });
      }

      await collection.updateMany(
        { userId },
        { $set: { completed, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true, completed });
    }

    // 4. DELETE /api/todos - Xóa tất cả công việc completed của user
    if (req.method === 'DELETE') {
      await collection.deleteMany({ userId, completed: true });
      return res.status(200).json({ success: true, message: 'Đã xóa tất cả công việc đã hoàn thành' });
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error (/api/todos):', error);
    return res.status(500).json({ error: 'Lỗi server khi tương tác MongoDB: ' + error.message });
  }
}
