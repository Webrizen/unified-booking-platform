import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { bookingId } = params;

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
    }

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}