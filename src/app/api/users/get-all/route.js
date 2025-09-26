import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'Users not found' }, { status: 404 });
    }

    // Exclude sensitive information
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords, { status: 200 });
  } catch (error) {
    console.error('Fetching user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}