import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { resourceId } = params;

    if (!resourceId || !ObjectId.isValid(resourceId)) {
      return NextResponse.json({ message: 'Invalid Resource ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const resource = await db.collection('resources').findOne({ _id: new ObjectId(resourceId) });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error('Error fetching public resource:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}