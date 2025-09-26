import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import qrcode from 'qrcode';

async function isRoomAvailable(db, resourceId, checkInDate, checkOutDate, session) {
  const bookings = await db.collection('bookings').find({
    resourceId: new ObjectId(resourceId),
    bookingType: 'room',
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      { 'details.roomBooking.checkInDate': { $lt: new Date(checkOutDate), $gte: new Date(checkInDate) } },
      { 'details.roomBooking.checkOutDate': { $gt: new Date(checkInDate), $lte: new Date(checkOutDate) } },
    ],
  }, { session }).toArray();
  return bookings.length === 0;
}

export async function POST(request) {
    const payload = await verifyToken(request);
    if (!payload || payload.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const session = client.startSession();

    let newBookingData;

    try {
        const body = await request.json();
        const { userId, resourceId, bookingType, details } = body;

        await session.withTransaction(async () => {
            if (!userId || !resourceId || !bookingType || !details) {
                throw new Error('Missing required fields');
            }

            const resource = await db.collection('resources').findOne({ _id: new ObjectId(resourceId) }, { session });
            if (!resource) throw new Error('Resource not found');

            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }, { session });
            if (!user) throw new Error('User not found');

            let totalPrice = 0;
            newBookingData = {
                userId: new ObjectId(userId),
                resourceId: new ObjectId(resourceId),
                bookingType,
                details: {},
                status: 'confirmed',
                createdBy: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            switch (bookingType) {
                case 'room':
                    const { checkInDate, checkOutDate } = details;
                    if (!checkInDate || !checkOutDate) throw new Error('Check-in and check-out dates are required');
                    if (!await isRoomAvailable(db, resourceId, checkInDate, checkOutDate, session)) {
                        throw new Error('Room not available for the selected dates');
                    }
                    const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
                    totalPrice = nights * resource.price;
                    newBookingData.details.roomBooking = details;
                    break;

                case 'marriageGarden':
                    const { eventDate } = details;
                    const existingGardenBooking = await db.collection('bookings').findOne({ resourceId: new ObjectId(resourceId), 'details.gardenBooking.eventDate': new Date(eventDate) }, { session });
                    if (existingGardenBooking) throw new Error('Marriage garden not available on the selected date');
                    totalPrice = resource.price;
                    newBookingData.details.gardenBooking = details;
                    newBookingData.passes = [];
                    break;

                case 'waterPark':
                    const { date, tickets } = details;
                    if (!date || !tickets || !Array.isArray(tickets)) throw new Error('Date and tickets are required');

                    newBookingData.details.waterParkBooking = { date, tickets: [] };
                    let parkTotalPrice = 0;
                    const createdTicketIds = [];

                    if (tickets.length > 0) {
                        const ticketsToInsert = [];
                        const origin = request.headers.get('origin');
                        for (const ticketInfo of tickets) {
                            const { type, price } = ticketInfo;
                            const uniqueId = new ObjectId();
                            const verificationUrl = `${origin}/verify/ticket/${uniqueId.toHexString()}`;
                            const qrCodeUrl = await qrcode.toDataURL(verificationUrl);

                            ticketsToInsert.push({
                                _id: uniqueId,
                                bookingId: null, // Placeholder
                                ticketType: 'waterPark',
                                details: { type, price },
                                qrCode: qrCodeUrl,
                                status: 'valid',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                            createdTicketIds.push(uniqueId);
                            parkTotalPrice += parseFloat(price);
                        }
                        await db.collection('tickets').insertMany(ticketsToInsert, { session });
                    }
                    totalPrice = parkTotalPrice;
                    newBookingData.details.waterParkBooking.tickets = createdTicketIds;
                    break;

                default:
                    throw new Error('Invalid booking type');
            }

            newBookingData.totalPrice = totalPrice;
            const result = await db.collection('bookings').insertOne(newBookingData, { session });
            const newBookingId = result.insertedId;
            newBookingData._id = newBookingId;

            if (bookingType === 'waterPark' && newBookingData.details.waterParkBooking.tickets.length > 0) {
                await db.collection('tickets').updateMany(
                    { _id: { $in: newBookingData.details.waterParkBooking.tickets } },
                    { $set: { bookingId: newBookingId } },
                    { session }
                );
            }
        });
    } catch (error) {
        console.error('Admin booking transaction failed:', error);
        return NextResponse.json({ message: error.message || 'Booking creation failed.' }, { status: 400 });
    } finally {
        await session.endSession();
    }

    return NextResponse.json({ success: true, booking: newBookingData }, { status: 201 });
}