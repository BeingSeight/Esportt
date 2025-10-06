import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('esport');

  if (req.method === 'POST') {
    // CREATE
    const { name, game, startDate, skillLevel, capacity } = req.body;
    if (!name || !game || !startDate || !skillLevel || !capacity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const result = await db.collection('tournaments').insertOne({
        name,
        game,
        startDate: new Date(startDate),
        skillLevel,
        capacity,
        registered: 0,
        status: 'Registration Open',
        createdAt: new Date(),
      });
      res.status(201).json({ message: 'Tournament added', tournamentId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'GET') {
    // READ
    try {
      const tournaments = await db.collection('tournaments').find({}).toArray();
      res.status(200).json(tournaments);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'PUT') {
    // UPDATE
    const { name, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Tournament name required for update' });
    }
    try {
      const result = await db.collection('tournaments').updateOne(
        { name },
        { $set: { status } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
      res.status(200).json({ message: 'Tournament updated' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Tournament name required for deletion' });
    }
    try {
      const result = await db.collection('tournaments').deleteOne({ name });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
      res.status(200).json({ message: 'Tournament deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
