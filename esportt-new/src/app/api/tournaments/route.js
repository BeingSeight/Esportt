import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Using relative path

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();

    // This fetches all documents from your 'tournaments' collection
    const tournaments = await db.collection('tournaments').find({}).toArray();

    return NextResponse.json({ success: true, data: tournaments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}