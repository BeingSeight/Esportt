import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Relative path

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseId = searchParams.get('firebaseId'); // Get ID from query

    if (!firebaseId) {
      return NextResponse.json({ success: false, error: 'Firebase ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const playerProfile = await db.collection('players').findOne({ firebaseId: firebaseId });

    if (!playerProfile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: playerProfile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}