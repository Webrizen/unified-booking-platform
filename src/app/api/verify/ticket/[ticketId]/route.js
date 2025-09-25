import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { ticketId } = params;

    if (!ticketId || !ObjectId.isValid(ticketId)) {
      return NextResponse.json({ message: 'Invalid Ticket ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const ticket = await db.collection('tickets').findOne({ _id: new ObjectId(ticketId) });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error('Error fetching ticket for verification:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}