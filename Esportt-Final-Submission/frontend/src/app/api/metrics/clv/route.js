import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const clvPipeline = [
      {
        $group: {
          _id: null,
          averageValue: { $avg: "$totalSpent" }
        }
      }
    ];

    const result = await db.collection('players').aggregate(clvPipeline).toArray();
    const clv = result.length > 0 ? result[0].averageValue : 0;

    return NextResponse.json({ success: true, data: { clv: clv } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}