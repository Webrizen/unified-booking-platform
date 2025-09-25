import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const query = type ? { resourceType: type } : {};
    const resources = await db.collection('resources').find(query).toArray();

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}