import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

// GET request: Calculates the NPS score
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const surveys = await db.collection('surveys').find({}).toArray();
    if (surveys.length === 0) {
      return NextResponse.json({ success: true, data: { nps: 0, promoters: 0, passives: 0, detractors: 0 } });
    }

    const promoters = surveys.filter(s => s.score >= 9).length;
    const detractors = surveys.filter(s => s.score <= 6).length;
    const total = surveys.length;

    const nps = ((promoters / total) - (detractors / total)) * 100;

    return NextResponse.json({ success: true, data: { nps: Math.round(nps), promoters, passives: total - promoters - detractors, detractors } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// POST request: Saves a new survey score
export async function POST(request) {
  try {
    const { score, userId } = await request.json();
    const { db } = await connectToDatabase();

    await db.collection('surveys').updateOne(
      { userId: userId },
      { $set: { score: score, createdAt: new Date() } },
      { upsert: true } // Creates a new doc if one doesn't exist for the user
    );
    return NextResponse.json({ success: true, message: 'Feedback saved' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}