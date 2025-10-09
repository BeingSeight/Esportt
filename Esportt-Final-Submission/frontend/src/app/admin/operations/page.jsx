'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import styles from '../leads/Leads.module.css'; // We can reuse the same table style

export default function OperationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/operations/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
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
      <h1 className="text-2xl font-semibold">Operations: Order Tracking</h1>
      <p className="text-sm text-gray-500">A real-time list of recent tournament entries ("orders").</p>

      {isLoading ? (
        <div className="flex items-center justify-center mt-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Player Name</th>
              <th className={styles.th}>Tournament Entered</th>
              <th className={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className={styles.td}>{order.playerName}</td>
                <td className={styles.td}>{order.tournamentTitle}</td>
                <td className={styles.td}>{new Date(order.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}