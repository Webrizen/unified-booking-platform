import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { sendBookingConfirmationEmail } from '@/lib/email';

// Helper function to check room availability
async function isRoomAvailable(db, resourceId, checkInDate, checkOutDate) {
  const bookings = await db.collection('bookings').find({
    resourceId: new ObjectId(resourceId),
    bookingType: 'room',
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      { 'details.roomBooking.checkInDate': { $lt: new Date(checkOutDate), $gte: new Date(checkInDate) } },
      { 'details.roomBooking.checkOutDate': { $gt: new Date(checkInDate), $lte: new Date(checkOutDate) } },
    ],
  }).toArray();
  return bookings.length === 0;
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const body = await request.json();
    const { userId, resourceId, bookingType, details } = body;

    if (!userId || !resourceId || !bookingType || !details) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const resource = await db.collection('resources').findOne({ _id: new ObjectId(resourceId) });
    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    let totalPrice = 0;
    let newBooking = {
      userId: new ObjectId(userId),
      resourceId: new ObjectId(resourceId),
      bookingType,
      details,
      status: 'confirmed', // Default to confirmed for simplicity
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (bookingType) {
      case 'room':
        const { checkInDate, checkOutDate } = details.roomBooking;
        if (!checkInDate || !checkOutDate) {
          return NextResponse.json({ message: 'Check-in and check-out dates are required' }, { status: 400 });
        }
        if (!await isRoomAvailable(db, resourceId, checkInDate, checkOutDate)) {
          return NextResponse.json({ message: 'Room not available for the selected dates' }, { status: 409 });
        }
        const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        totalPrice = nights * resource.price;
        break;

      case 'marriageGarden':
        const { eventDate } = details.gardenBooking;
        // Simplified availability check for gardens
        const existingGardenBooking = await db.collection('bookings').findOne({ resourceId: new ObjectId(resourceId), 'details.gardenBooking.eventDate': new Date(eventDate) });
        if (existingGardenBooking) {
          return NextResponse.json({ message: 'Marriage garden not available on the selected date' }, { status: 409 });
        }
        totalPrice = resource.price; // Price might depend on services, simplified here
        break;

      case 'waterPark':
        let parkTotalPrice = 0;
        details.waterParkBooking.tickets.forEach(ticket => {
          parkTotalPrice += ticket.quantity * resource.price; // Simplified pricing
        });
        totalPrice = parkTotalPrice;
        break;

      default:
        return NextResponse.json({ message: 'Invalid booking type' }, { status: 400 });
    }

    newBooking.totalPrice = totalPrice;

    const result = await db.collection('bookings').insertOne(newBooking);
    newBooking._id = result.insertedId;

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (user) {
      await sendBookingConfirmationEmail(user.email, newBooking);
    }

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}