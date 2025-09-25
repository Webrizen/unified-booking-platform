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
    const { passes } = body; // Expecting an array of passes to be issued

    if (!passes || !Array.isArray(passes) || passes.length === 0) {
      return NextResponse.json({ message: 'Passes information is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    if (booking.bookingType !== 'marriageGarden') {
      return NextResponse.json({ message: 'This booking is not for a marriage garden' }, { status: 400 });
    }

    const createdPasses = [];
    const createdPassIds = [];
    for (const passInfo of passes) {
      const { eventName, guestName, accessLevel } = passInfo;
      const uniqueId = new ObjectId();
      const qrCodeData = JSON.stringify({ bookingId, passId: uniqueId.toHexString(), guestName });
      const qrCodeUrl = await qrcode.toDataURL(qrCodeData);

      const newPass = {
        _id: uniqueId,
        bookingId: new ObjectId(bookingId),
        passType: 'marriageGarden',
        details: {
          eventName,
          guestName,
          accessLevel,
        },
        qrCode: qrCodeUrl,
        status: 'valid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('passes').insertOne(newPass);
      createdPasses.push(newPass);
      createdPassIds.push(newPass._id);
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      { $push: { passes: { $each: createdPassIds } } }
    );

    return NextResponse.json({ success: true, message: 'Passes issued successfully', passes: createdPasses }, { status: 201 });
  } catch (error) {
    console.error('Error issuing passes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}