'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import styles from './Admin.module.css';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState({ rfm: [], nps: null, clv: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rfmRes, npsRes, clvRes] = await Promise.all([
          fetch('/api/metrics/rfm'),
          fetch('/api/metrics/nps'),
          fetch('/api/metrics/clv'),
        ]);

        const rfmData = await rfmRes.json();
        const npsData = await npsRes.json();
        const clvData = await clvRes.json();

        setMetrics({
          rfm: rfmData.data || [],
          nps: npsData.data,
          clv: clvData.data,
        });

      } catch (error) {
        console.error("Failed to fetch metrics data:", error);
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
      <div className={styles.header}>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Business metrics and platform insights.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center mt-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400">Net Promoter Score (NPS)</h3>
              <p className="text-3xl font-bold text-white">{metrics.nps?.nps || 0}</p>
              <p className="text-xs text-gray-500">{metrics.nps?.promoters || 0} Promoters, {metrics.nps?.detractors || 0} Detractors</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-gray-400">Average Customer Value (CLV)</h3>
              <p className="text-3xl font-bold text-white">${metrics.clv?.clv?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-500">Based on average total spend</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold">RFM Segmentation (Top Players)</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Player Name</th>
                <th className={styles.th}>Recency (Days)</th>
                <th className={styles.th}>Frequency</th>
                <th className={styles.th}>Monetary</th>
              </tr>
            </thead>
            <tbody>
              {metrics.rfm.map((player, index) => (
                <tr key={index}>
                  <td className={styles.td}>{player.name}</td>
                  <td className={styles.td}>{Math.round(player.recency)}</td>
                  <td className={styles.td}>{player.frequency}</td>
                  <td className={styles.td}>${player.monetary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}