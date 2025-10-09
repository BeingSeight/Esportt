import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PriorityQueue from '@/lib/priorityQueue';

// Helper to assign a numerical priority to each tier
const getPriority = (experienceLevel) => {
  switch (experienceLevel) {
    case 'Gold Tier': return 1; // Highest priority
    case 'Silver Tier': return 2;
    case 'Bronze Tier': return 3; // Lowest priority
    default: return 4;
  }
};

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const players = await db.collection('players').find({}).toArray();

        const queue = new SimplePriorityQueue();

    players.forEach(player => {
      const priority = getPriority(player.experienceLevel);
      leadQueue.enqueue(player, priority);
    });

    // Dequeue all items to get them in sorted order
    const prioritizedLeads = [];
    while (!leadQueue.isEmpty()) {
      prioritizedLeads.push(leadQueue.dequeue().element);
    }

    return NextResponse.json({ success: true, data: prioritizedLeads });
  } catch (error) {
    console.error("Lead Prioritization Error:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}