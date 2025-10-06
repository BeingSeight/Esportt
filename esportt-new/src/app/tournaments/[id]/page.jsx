'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tournaments/${id}`)
      .then(res => res.json())
      .then(data => {
        setTournament(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: 32 }}>Loading tournament...</div>;
  if (!tournament) return <div style={{ padding: 32 }}>Tournament not found.</div>;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1>{tournament.name}</h1>
      <p><strong>Status:</strong> {tournament.status || '-'}</p>
      <p><strong>Start Date:</strong> {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : '-'}</p>
      <p><strong>Description:</strong> {tournament.description || 'No description.'}</p>

      {/* Registration logic (if applicable) */}
      <section style={{ marginTop: 24 }}>
        <h2>Register</h2>
        {/* Add registration form or button here */}
        <button disabled>Registration coming soon</button>
      </section>

      {/* Results logic (if applicable) */}
      <section style={{ marginTop: 24 }}>
        <h2>Results</h2>
        {tournament.results && tournament.results.length > 0 ? (
          <ul>
            {tournament.results.map((result, idx) => (
              <li key={idx}>{result.playerName}: {result.score}</li>
            ))}
          </ul>
        ) : (
          <p>No results yet.</p>
        )}
      </section>
    </div>
  );
}
