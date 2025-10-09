import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { firebaseId, email, name, experienceLevel } = await request.json();

    console.log('Register API called with data:', { firebaseId, email, name, experienceLevel });

    if (!firebaseId || !email || !name || !experienceLevel) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    console.log('Database connected successfully for registration');

    await db.collection('players').insertOne({
      firebaseId,
      email,
      name,
      experienceLevel,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Player profile created' }, { status: 201 });
  } catch (error) {
    console.error('Register API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}