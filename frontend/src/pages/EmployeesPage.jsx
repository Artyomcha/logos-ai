import React, { useEffect, useState } from 'react';
import styles from '../styles/EmployeesPage.module.css';
import { getEmployeeStats } from '../services/api';
import EmployeeDetailsPage from './EmployeeDetailsPage';

function getRatingColor(rating) {
  if (rating >= 8) return styles.ratingGreen;
  if (rating >= 7) return styles.ratingYellow;
  if (rating < 6) return styles.ratingRed;
  return styles.ratingDefault;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    getEmployeeStats().then(data => {
      setEmployees([...data].sort((a, b) => b.rating - a.rating));
    });
  }, []);

  if (selectedEmployeeId) {
    return <EmployeeDetailsPage employeeId={selectedEmployeeId} onBack={() => setSelectedEmployeeId(null)} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span className={styles.headerCell}>Имя</span>
        <span className={styles.headerCell}>Рейтинг</span>
        <span className={styles.headerCell}></span>
      </div>
      {employees.map((emp, idx) => (
        <div className={styles.employeeRow} key={emp.id}>
          <span className={styles.rank}>#{idx + 1}</span>
          <img
                          src={emp.avatar_url ? `https://logos-backend-production.up.railway.app${emp.avatar_url}` : '/default-avatar.png'}
            alt={emp.first_name + ' ' + emp.last_name}
            className={styles.avatar}
          />
          <span className={styles.name}>{emp.first_name} {emp.last_name}</span>
          <span className={`${styles.rating} ${getRatingColor(emp.rating)}`}>
            {emp.rating ? emp.rating.toString().replace('.', ',') : '0'}
          </span>
          <button className={styles.detailsBtn} onClick={() => setSelectedEmployeeId(emp.id)}>
            Подробнее о сотруднике
          </button>
        </div>
      ))}
    </div>
  );
} 