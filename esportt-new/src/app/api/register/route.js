// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { firebaseId, email, experienceLevel } = await request.json();

    if (!firebaseId || !email || !experienceLevel) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection('players').insertOne({
      firebaseId,
      email,
      experienceLevel,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Player profile created' }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}