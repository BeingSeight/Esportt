import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // Get the 'level' query parameter

    const { db } = await connectToDatabase();

    const query = {};
    if (level) {
      // If a level is provided, add it to the MongoDB query
      query.experienceLevel = level; 
    }

const tutorials = await db.collection('tutorials').find(query).toArray();

    return NextResponse.json({ success: true, data: tutorials }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}