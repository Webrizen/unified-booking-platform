import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = params;
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.bookingType === 'waterPark') {
      const tickets = await db.collection('tickets').find({ _id: { $in: booking.details.waterParkBooking.tickets } }).toArray();
      booking.details.waterParkBooking.tickets = tickets;
    }

    if (booking.bookingType === 'marriageGarden') {
      const passes = await db.collection('passes').find({ _id: { $in: booking.passes } }).toArray();
      booking.passes = passes;
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    try {
      const payload = await verifyToken(request);
      if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { bookingId } = params;
      const body = await request.json();
      const { status } = body;

      if (!status) {
        return NextResponse.json({ message: 'Status is required' }, { status: 400 });
      }

      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME);

      const result = await db.collection('bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Booking status updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error updating booking status:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }