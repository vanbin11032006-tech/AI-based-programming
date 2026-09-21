import clientPromise from '../../lib/mongodb.js';
import { verifyPassword, generateToken } from '../../lib/auth.js';

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
    const { emailOrUsername, password } = req.body || {};

    if (!emailOrUsername || !emailOrUsername.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập Email hoặc Tên người dùng' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Vui lòng nhập Mật khẩu' });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    const input = emailOrUsername.trim().toLowerCase();

    // Tìm user theo email hoặc username
    const user = await usersCollection.findOne({
      $or: [{ email: input }, { username: emailOrUsername.trim() }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Email/Tên đăng nhập hoặc Mật khẩu không chính xác' });
    }

    // Kiểm tra mật khẩu
    const isPasswordMatch = await verifyPassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Email/Tên đăng nhập hoặc Mật khẩu không chính xác' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập: ' + error.message });
  }
}
