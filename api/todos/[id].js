import clientPromise from '../../lib/mongodb.js';
import { ObjectId } from 'mongodb';

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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  // Hỗ trợ xóa tất cả completed nếu id === 'completed'
  if (id === 'completed' && req.method === 'DELETE') {
    try {
      const collection = await getCollection();
      await collection.deleteMany({ completed: true });
      return res.status(200).json({ success: true, message: 'Đã xóa tất cả công việc đã hoàn thành' });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server: ' + error.message });
    }
  }

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID công việc không hợp lệ' });
  }

  try {
    const collection = await getCollection();

    // 1. PUT /api/todos/[id] - Cập nhật công việc trong MongoDB
    if (req.method === 'PUT') {
      const { title, completed, priority } = req.body || {};
      const updateData = { updatedAt: new Date().toISOString() };

      if (typeof title === 'string' && title.trim()) updateData.title = title.trim();
      if (typeof completed === 'boolean') updateData.completed = completed;
      if (priority) updateData.priority = priority;

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Không tìm thấy công việc để sửa' });
      }

      return res.status(200).json(formatTodo(result));
    }

    // 2. DELETE /api/todos/[id] - Xóa 1 công việc khỏi MongoDB
    if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Không tìm thấy công việc để xóa' });
      }
      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error (/api/todos/[id]):', error);
    return res.status(500).json({ error: 'Lỗi server khi tương tác MongoDB: ' + error.message });
  }
}
