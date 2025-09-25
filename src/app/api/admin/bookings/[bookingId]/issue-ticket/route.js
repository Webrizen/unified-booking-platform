import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import qrcode from 'qrcode';

export async function POST(request, { params }) {
  try {
    const payload = await verifyToken(request);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId } = params;
    const body = await request.json();
    const { tickets } = body; // Expecting an array of tickets to be issued

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({ message: 'Tickets information is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.bookingType !== 'waterPark') {
      return NextResponse.json({ message: 'This booking is not for a water park' }, { status: 400 });
    }

    const createdTickets = [];
    const createdTicketIds = [];
    for (const ticketInfo of tickets) {
      const { type, price } = ticketInfo;
      const uniqueId = new ObjectId();
      const verificationUrl = `${request.nextUrl.origin}/verify/ticket/${uniqueId.toHexString()}`;
      const qrCodeUrl = await qrcode.toDataURL(verificationUrl);

      const newTicket = {
        _id: uniqueId,
        bookingId: new ObjectId(bookingId),
        ticketType: 'waterPark',
        details: {
          type,
          price,
        },
        qrCode: qrCodeUrl,
        status: 'valid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('tickets').insertOne(newTicket);
      createdTickets.push(newTicket);
      createdTicketIds.push(newTicket._id);
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      { $push: { 'details.waterParkBooking.tickets': { $each: createdTicketIds } } }
    );

    return NextResponse.json({ success: true, message: 'Tickets issued successfully', tickets: createdTickets }, { status: 201 });
  } catch (error) {
    console.error('Error issuing tickets:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}