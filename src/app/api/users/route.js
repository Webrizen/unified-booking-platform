import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { name, email, password, phone } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    return NextResponse.json({ success: true, userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Exclude sensitive information
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Fetching user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}