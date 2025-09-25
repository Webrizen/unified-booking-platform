import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { sendBookingConfirmationEmail } from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { bookingType, details, userId, resourceId } = req.body;

  if (!bookingType || !details || !userId || !resourceId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = await clientPromise;
  const db = client.db('your-database-name');
  const collection = db.collection('bookings');
  
  let totalPrice = 0; // Initialize total price
  
  try {
    const resource = await db.collection('resources').findOne({ _id: new ObjectId(resourceId) });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Type-specific validation and price calculation
    switch (bookingType) {
      case 'room':
        // Check if room is available for the date range
        // Calculate price based on nights and room price
        break;
      case 'marriageGarden':
        // Check if the garden and time slot are available
        // Calculate price based on garden and services
        break;
      case 'waterPark':
        // Check if tickets are available for the date
        // Calculate price based on ticket types and quantities
        break;
      default:
        return res.status(400).json({ message: 'Invalid booking type' });
    }

    const newBooking = {
      userId: new ObjectId(userId),
      resourceId: new ObjectId(resourceId),
      bookingType,
      details,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
    };
    
    const result = await collection.insertOne(newBooking);
    
    // A simplified email send (you'd get the real user email from the DB)
    const mockUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (mockUser) {
      await sendBookingConfirmationEmail(mockUser.email, newBooking);
    }

    res.status(201).json({ success: true, bookingId: result.insertedId });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
