import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('esport');

  // Example assumes a 'transactions' collection with { email, amount, createdAt }
  const pipeline = [
    {
      $group: {
        _id: '$email',
        lastActivity: { $max: '$createdAt' }, // Recency
        frequency: { $sum: 1 },              // Frequency
        totalSpend: { $sum: '$amount' }      // Monetary
      }
    },
    { $sort: { totalSpend: -1 } }
  ];

  const data = await db.collection('transactions').aggregate(pipeline).toArray();
  return Response.json(data);
}