// ✅ AFTER Zod in src/app/api/teams/route.js

import { NextResponse } from 'next/server';
import { z } from 'zod'; // 1. Import Zod
import clientPromise from '../../../lib/mongodb';

// 2. Define the schema for creating a team
const createTeamSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(50),
  game: z.string().nonempty("A game must be selected"),
  captainId: z.string().uuid("Invalid captain ID format"), // Assuming captainId is a UUID
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 3. Validate the request body against the schema
    const validation = createTeamSchema.safeParse(body);

    // 4. If validation fails, return a detailed error
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    // 5. If validation succeeds, use the clean data
    const { teamName, game, captainId } = validation.data;

    const { db } = await connectToDatabase();
    const result = await db.collection('teams').insertOne({ teamName, game, captainId });

    return NextResponse.json({ success: true, data: result.insertedId }, { status: 201 });
  } catch (error) {
    // This catches server errors, not validation errors
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}