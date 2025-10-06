// src/components/BrowserMockup.jsx
'use client';

import Link from "next/link";
import { ShimmerButton } from "./ui/shimmer-button"; // Import the new button
import styles from './BrowserMockup.module.css';

export default function BrowserMockup() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={`${styles.dot} ${styles.dotRed}`} />
          <div className={`${styles.dot} ${styles.dotYellow}`} />
          <div className={`${styles.dot} ${styles.dotGreen}`} />
          <div className={styles.headerText}>EsportTT</div>
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Your Arena Awaits
          </h1>
          <p className={styles.description}>
            The ultimate platform for competitive gaming. Create, compete, and conquer. Join tournaments, complete quests, and rise to the top.
          </p>

          {/* Replace the old Link/Button with the new ShimmerButton */}
          <Link href="/register">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                Get Started Now
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
}