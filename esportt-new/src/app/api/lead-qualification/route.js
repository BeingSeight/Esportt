import clientPromise from '../../../lib/mongodb';
import { SimplePriorityQueue } from '../../../lib/priorityQueue';

function calculateUrgency(tournamentDate, skillGap) {
  const daysLeft = Math.ceil((new Date(tournamentDate) - new Date()) / (1000 * 60 * 60 * 24));
  const timeUrgency = Math.max(1, 10 - daysLeft);
  const skillUrgency = Math.min(10, skillGap * 2);
  return Math.floor((timeUrgency + skillUrgency) / 2);
}

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db('esport');

  const players = await db.collection('players').find({}).toArray();
  const tournaments = await db.collection('tournaments').find({}).toArray();

  const queue = new SimplePriorityQueue();

  players.forEach(player => {
    const nextTournament = tournaments[0];
    const skillGap = Math.abs((nextTournament?.skillLevel || 5) - (player.skill || 5));
    const urgency = calculateUrgency(nextTournament?.startDate || new Date(), skillGap);
    queue.enqueue({ player, nextTournament }, urgency);
  });

  const prioritized = queue.items.map(item => ({
    player: item.element.player,
    tournament: item.element.nextTournament,
    urgency: item.priority
  }));

  return Response.json(prioritized);
}
