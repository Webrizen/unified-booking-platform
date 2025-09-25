import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { generateTicketPdf } from '@/lib/pdf';

export async function GET(request, { params }) {
  try {
    const payload = await verifyToken(request);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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

    const pdfBytes = await generateTicketPdf(ticket);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${ticketId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}