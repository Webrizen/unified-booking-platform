import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const payload = await verifyToken(request);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const userCount = await db.collection('users').countDocuments();

    return NextResponse.json({ count: userCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}