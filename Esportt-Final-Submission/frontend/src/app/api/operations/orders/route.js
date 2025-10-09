import { NextResponse } from 'next/server';
// ✅ CORRECTED PATH
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();

    const orders = await db.collection('tournament_entries').find({}).sort({ timestamp: -1 }).toArray();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}