import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('esport');

  // Assumes a 'transactions' collection with { email, amount }
  const pipeline = [
    {
      $group: {
        _id: '$email',
        clv: { $sum: '$amount' }
      }
    },
    { $sort: { clv: -1 } }
  ];

  const data = await db.collection('transactions').aggregate(pipeline).toArray();
  return Response.json(data);
}
