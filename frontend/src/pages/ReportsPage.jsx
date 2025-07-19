import React from 'react';
import styles from '../styles/ReportsPage.module.css';

const ReportsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid3}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Project cost</div>
          <div className={styles.cardValue}>$600</div>
          <div className={styles.cardGraph}>[График]</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Time Management</div>
          <div className={styles.cardPie}>[Pie]</div>
          <div className={styles.cardDesc}>Work 45%<br />Design 25%<br />Plan 25%</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>AVG. Tasks cost</div>
          <div className={styles.cardGraph}>[Bar]</div>
          <div className={styles.cardDesc}>Data A: $130, Data B: $240, Data C: $70</div>
        </div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Work progress</div>
          <div className={styles.cardGraph}>[Bar]</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Revenue</div>
          <div className={styles.cardGraph}>[Line]</div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 