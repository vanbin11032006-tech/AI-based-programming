import clientPromise from '../../lib/mongodb.js';
import { hashPassword, generateToken } from '../../lib/auth.js';

const DB_NAME = process.env.MONGODB_DB_NAME || 'todo_db';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

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

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await usersCollection.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ error: 'Email này đã được đăng ký' });
      }
      return res.status(400).json({ error: 'Tên người dùng này đã được sử dụng' });
    }

    // Mã hóa mật khẩu và tạo người dùng mới
    const hashedPassword = await hashPassword(password);
    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(newUser);
    const createdUser = {
      _id: result.insertedId,
      username: cleanUsername,
      email: cleanEmail,
    };

    const token = generateToken(createdUser);

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      token,
      user: {
        id: result.insertedId.toString(),
        username: cleanUsername,
        email: cleanEmail,
      },
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ error: 'Lỗi server khi đăng ký: ' + error.message });
  }
}
