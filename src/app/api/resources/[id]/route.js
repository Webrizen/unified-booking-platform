import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid resource ID' }, { status: 400 });
    }

    const resource = await db.collection('resources').findOne({ _id: new ObjectId(id) });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}