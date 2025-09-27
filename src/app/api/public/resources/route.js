import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type'); // e.g., 'room', 'marriageGarden', 'waterPark'

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    let filter = {};

    if (query) {
      filter.$text = { $search: query };
    }

    if (type) {
      filter.resourceType = type;
    }

    // Ensure the text index exists on the 'name' and 'description' fields in the 'resources' collection
    // You can create it in MongoDB shell with:
    // db.resources.createIndex({ name: "text", description: "text" })

    const resources = await db.collection('resources').find(filter).toArray();

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error('Error fetching public resources:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}