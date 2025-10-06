import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('esport');

  if (req.method === 'POST') {
    // CREATE
    const { title, game, skillLevel, duration, topics, difficulty } = req.body;
    if (!title || !game || !skillLevel || !duration || !topics || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const result = await db.collection('tutorials').insertOne({
        title,
        game,
        skillLevel,
        duration,
        topics,
        difficulty,
        createdAt: new Date(),
      });
      res.status(201).json({ message: 'Tutorial added', tutorialId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'GET') {
    // READ
    try {
      const tutorials = await db.collection('tutorials').find({}).toArray();
      res.status(200).json(tutorials);
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'PUT') {
    // UPDATE
    const { title, duration, difficulty } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Tutorial title required for update' });
    }
    try {
      const result = await db.collection('tutorials').updateOne(
        { title },
        { $set: { duration, difficulty } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Tutorial not found' });
      }
      res.status(200).json({ message: 'Tutorial updated' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'DELETE') {
    // DELETE
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Tutorial title required for deletion' });
    }
    try {
      const result = await db.collection('tutorials').deleteOne({ title });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Tutorial not found' });
      }
      res.status(200).json({ message: 'Tutorial deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
