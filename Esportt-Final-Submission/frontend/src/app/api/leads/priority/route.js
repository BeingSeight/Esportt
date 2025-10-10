// src/app/api/leads/priority/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
// Import the MinPriorityQueue from the new library
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

/**
 * A helper function to determine priority based on experience level.
 * (This function remains the same)
 */
function getPriority(experienceLevel) {
  switch (experienceLevel?.toLowerCase()) {
    case 'professional':
      return 1;
    case 'advanced':
      return 2;
    case 'intermediate':
      return 3;
    case 'beginner':
      return 4;
    default:
      return 5;
  }
}

export async function GET(req) {
  try {
    // 1. Connect to the database
    const { db } = await connectToDatabase();

    // 2. Fetch all players
    const players = await db.collection('players').find({}).toArray();

    // 3. Initialize the new priority queue
    const queue = new MinPriorityQueue();

    // 4. Enqueue players (the .enqueue() method is the same)
    players.forEach(player => {
      const priority = getPriority(player.experienceLevel);
      queue.enqueue(player, priority);
    });

    // 5. Dequeue all players to create the sorted list
    const prioritizedLeads = [];
    while (!queue.isEmpty()) {
      // IMPORTANT: Access the .element property from the dequeued object
      prioritizedLeads.push(queue.dequeue().element);
    }

    // 6. Return the sorted list
    return NextResponse.json({ leads: prioritizedLeads }, { status: 200 });

  } catch (error) {
    console.error("Lead Prioritization Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}