import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const rfmPipeline = [
      {
        $project: {
          _id: 0, email: 1, name: 1,
          recency: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000*60*60*24] },
          frequency: { $ifNull: ["$loginCount", 1] },
          monetary: { $ifNull: ["$totalSpent", 0] }
        }
      },
      { $sort: { recency: 1, frequency: -1, monetary: -1 } },
      { $limit: 10 }
    ];

    const rfmResults = await db.collection('players').aggregate(rfmPipeline).toArray();
    return NextResponse.json({ success: true, data: rfmResults });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}