import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseId = searchParams.get('firebaseId'); // Get ID from query

    console.log('Profile API called with firebaseId:', firebaseId);

    if (!firebaseId) {
      return NextResponse.json({ success: false, error: 'Firebase ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    console.log('Database connected successfully');

    const playerProfile = await db.collection('players').findOne({ firebaseId: firebaseId });

    if (!playerProfile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: playerProfile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      success: false, 
      error: 'Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}