'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import styles from './Tournaments.module.css';

export default function TournamentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ✅ FIX 1: Initialize state with an empty array []
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/tournaments');
        const data = await res.json();

        // ✅ FIX 2: Check for success and set state with data.data (the array)
        if (data.success) {
          setTournaments(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchTournaments();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">All Tournaments</h1>
      <p className="text-gray-400">Browse all available tournaments across all tiers.</p>

      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Tournament Name</th>
              <th className={styles.th}>Required Tier</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t._id} className={styles.tr}>
                <td className={styles.td}>{t.title}</td>
                <td className={styles.td}>{t.experienceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}