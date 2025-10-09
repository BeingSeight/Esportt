import clientPromise from '../../../lib/mongodb';
import { ReferralNetworkAnalyzer } from '../../../lib/referralNetworkAnalyzer';

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db('esport');

  // Get all players from DB
  const players = await db.collection('players').find({}).toArray();

  // Get startEmail from query params
  const { searchParams } = new URL(request.url);
  const startEmail = searchParams.get('email');

  if (!startEmail) {
    return Response.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  // Analyze referral network
  const analyzer = new ReferralNetworkAnalyzer();
  const result = analyzer.analyzeNetwork(players, startEmail);

  return Response.json(result);
}
