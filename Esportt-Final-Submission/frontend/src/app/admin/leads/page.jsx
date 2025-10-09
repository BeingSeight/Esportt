'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import styles from './Leads.module.css';

export default function LeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/leads/priority');
        const data = await res.json();
        if (data.success) {
          setLeads(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Prioritized Leads</h1>
      <p className="text-sm text-gray-500">New users sorted by experience tier (Gold &gt; Silver &gt; Bronze)</p>

      {isLoading ? (
        <div className="flex items-center justify-center mt-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Priority</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Tier</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.firebaseId || index}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{lead.name}</td>
                <td className={styles.td}>{lead.email}</td>
                <td className={styles.td}>{lead.experienceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}