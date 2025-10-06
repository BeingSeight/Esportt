import clientPromise from '../../../lib/mongodb';
import { ActivityAnalyzer } from '../../../lib/activityAnalyzer';

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db('esport');

  // Get all players from DB
  const players = await db.collection('players').find({}).toArray();

  // Get targetSkillSum from query params (default: 10)
  const { searchParams } = new URL(request.url);
  const targetSkillSum = parseInt(searchParams.get('target') || '10', 10);

  // Find optimal pairs
  const analyzer = new ActivityAnalyzer();
  const pairs = analyzer.findOptimalPairs(players, targetSkillSum);

  return Response.json(pairs);
}
