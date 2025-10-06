'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [leadQueue, setLeadQueue] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [referral, setReferral] = useState(null);
  const [rfm, setRfm] = useState([]);
  const [nps, setNps] = useState({});
  const [clv, setClv] = useState([]);

  useEffect(() => {
    fetch('/api/players').then(res => res.json()).then(setPlayers);
    fetch('/api/tournaments').then(res => res.json()).then(setTournaments);
    fetch('/api/tutorials').then(res => res.json()).then(setTutorials);
    fetch('/api/lead-qualification').then(res => res.json()).then(setLeadQueue);
    fetch('/api/player-matching?target=10').then(res => res.json()).then(setPairs);
    fetch('/api/referral-network?email=test@example.com').then(res => res.json()).then(setReferral);
    fetch('/api/metrics/rfm').then(res => res.json()).then(setRfm);
    fetch('/api/metrics/nps').then(res => res.json()).then(setNps);
    fetch('/api/metrics/clv').then(res => res.json()).then(setClv);
  }, []);

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>EsportTT Dashboard</h1>

      <section>
        <h2>Players</h2>
        <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Skill</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p._id}>
                <td>{p.email}</td>
                <td>{p.name}</td>
                <td>{p.skill}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Tournaments</h2>
        {tournaments.length === 0 ? <p>No tournaments found.</p> : (
          <ul>
            {tournaments.map(t => (
              <li key={t._id}>{t.name} ({t.startDate})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Tutorials</h2>
        {tutorials.length === 0 ? <p>No tutorials found.</p> : (
          <ul>
            {tutorials.map(t => (
              <li key={t._id}>{t.title} (Skill: {t.skillLevel})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Lead Qualification (Priority Queue)</h2>
        {leadQueue.length === 0 ? <p>No leads found.</p> : (
          <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {leadQueue.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.player.name} ({item.player.email})</td>
                  <td>{item.urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Player Matching (Two-Pointer)</h2>
        {pairs.length === 0 ? <p>No pairs found.</p> : (
          <ul>
            {pairs.map((pair, idx) => (
              <li key={idx}>
                {pair.player1.name} + {pair.player2.name} (Sum: {pair.skillSum})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Referral Network (BFS)</h2>
        {referral ? (
          <div>
            <p>Depth: {referral.depth}</p>
            <p>Connections: {referral.connections.join(', ')}</p>
          </div>
        ) : <p>No referral data.</p>}
      </section>

      <section>
        <h2>RFM Metrics</h2>
        {rfm.length === 0 ? <p>No RFM data.</p> : (
          <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Last Activity</th>
                <th>Frequency</th>
                <th>Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {rfm.map((row, idx) => (
                <tr key={idx}>
                  <td>{row._id}</td>
                  <td>{row.lastActivity ? new Date(row.lastActivity).toLocaleString() : '-'}</td>
                  <td>{row.frequency}</td>
                  <td>{row.totalSpend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>NPS Metrics</h2>
        <div>
          <p>NPS: {nps.nps}</p>
          <p>Promoters: {nps.promoters}</p>
          <p>Detractors: {nps.detractors}</p>
          <p>Total: {nps.total}</p>
        </div>
      </section>

      <section>
        <h2>CLV Metrics</h2>
        {clv.length === 0 ? <p>No CLV data.</p> : (
          <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>CLV</th>
              </tr>
            </thead>
            <tbody>
              {clv.map((row, idx) => (
                <tr key={idx}>
                  <td>{row._id}</td>
                  <td>{row.clv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
