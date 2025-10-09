import clientPromise from '../../../lib/mongodb';

// Handle POST (create), GET (read), PUT (update), DELETE (delete)
export async function POST(request) {
  const client = await clientPromise;
  const db = client.db('esport');
  const body = await request.json();

  const { email, tournamentId, name, skill } = body;

  if (!email || !tournamentId || !name || !skill) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Duplicate detection: check if player already registered for this tournament
  const existing = await db.collection('players').findOne({ email, tournamentId });
  if (existing) {
    return Response.json({ error: 'Duplicate registration detected' }, { status: 409 });
  }

  // Insert new player
  const result = await db.collection('players').insertOne({
    email,
    tournamentId,
    name,
    skill,
    status: 'Prospect',
    createdAt: new Date(),
  });

  return Response.json({ message: 'Player added', playerId: result.insertedId }, { status: 201 });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db('esport');
  const players = await db.collection('players').find({}).toArray();
  return Response.json(players);
}

export async function PUT(request) {
  const client = await clientPromise;
  const db = client.db('esport');
  const body = await request.json();

  const { email, tournamentId, name, skill, status } = body;
  if (!email || !tournamentId) {
    return Response.json({ error: 'Email and tournamentId required for update' }, { status: 400 });
  }

  const result = await db.collection('players').updateOne(
    { email, tournamentId },
    { $set: { name, skill, status } }
  );
  if (result.matchedCount === 0) {
    return Response.json({ error: 'Player not found' }, { status: 404 });
  }
  return Response.json({ message: 'Player updated' });
}

export async function DELETE(request) {
  const client = await clientPromise;
  const db = client.db('esport');
  const body = await request.json();

  const { email, tournamentId } = body;
  if (!email || !tournamentId) {
    return Response.json({ error: 'Email and tournamentId required for deletion' }, { status: 400 });
  }

  const result = await db.collection('players').deleteOne({ email, tournamentId });
  if (result.deletedCount === 0) {
    return Response.json({ error: 'Player not found' }, { status: 404 });
  }
  return Response.json({ message: 'Player deleted' });
}
