import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { generatePassPdf } from '@/lib/pdf';

export async function GET(request, { params }) {
  try {
    const payload = await verifyToken(request);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { passId } = params;

    if (!passId || !ObjectId.isValid(passId)) {
      return NextResponse.json({ message: 'Invalid Pass ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const pass = await db.collection('passes').findOne({ _id: new ObjectId(passId) });

    if (!pass) {
      return NextResponse.json({ message: 'Pass not found' }, { status: 404 });
    }

    const pdfBytes = await generatePassPdf(pass);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pass-${passId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating pass PDF:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}