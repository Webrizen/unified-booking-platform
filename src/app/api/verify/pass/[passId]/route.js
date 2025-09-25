import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
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

    return NextResponse.json(pass, { status: 200 });
  } catch (error) {
    console.error('Error fetching pass for verification:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}