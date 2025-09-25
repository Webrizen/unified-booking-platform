import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { userId } = params;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const bookings = await db.collection('bookings').find({ userId: new ObjectId(userId) }).toArray();

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}