import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('esport');

  // Assumes a 'survey' collection with { email, score } where score is 0-10
  const pipeline = [
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        promoters: { $sum: { $cond: [{ $gte: ['$score', 9] }, 1, 0] } },
        detractors: { $sum: { $cond: [{ $lte: ['$score', 6] }, 1, 0] } }
      }
    }
  ];

  const [result] = await db.collection('survey').aggregate(pipeline).toArray();
  const total = result?.total || 0;
  const promoters = result?.promoters || 0;
  const detractors = result?.detractors || 0;
  const nps = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

  return Response.json({ nps, promoters, detractors, total });
}
