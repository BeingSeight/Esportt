// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Relative path

export async function POST(request) {
  try {
    // 1. Read 'name' from the request body, in addition to the other fields.
    const { firebaseId, email, name, experienceLevel } = await request.json();

    if (!firebaseId || !email || !name || !experienceLevel) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection('players').insertOne({
      firebaseId,
      email,
      name, // 2. Add the 'name' field to the document being saved.
      experienceLevel,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Player profile created' }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}