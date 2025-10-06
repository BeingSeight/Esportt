'use client';

import { useEffect, useState } from 'react';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setTournaments(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1>Tournaments</h1>
      {loading ? (
        <p>Loading tournaments...</p>
      ) : tournaments.length === 0 ? (
        <p>No tournaments found.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.startDate ? new Date(t.startDate).toLocaleDateString() : '-'}</td>
                <td>{t.status || '-'}</td>
                <td>
                  {/* For details page, see next step */}
                  <a href={`/tournaments/${t._id}`}>View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
