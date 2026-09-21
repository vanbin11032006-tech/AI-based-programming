import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Thảm họa: Chưa cấu hình biến môi trường MONGODB_URI trên Vercel hoặc trong .env.local!');
}

const options = {};
let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  clientPromise = Promise.reject(new Error('Biến môi trường MONGODB_URI chưa được thiết lập trên Vercel Dashboard'));
}

export default clientPromise;
