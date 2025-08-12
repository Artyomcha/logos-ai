import React, { useEffect, useState } from 'react';
import styles from '../styles/MainPage.module.css';
import { getProfile, getEmployeeStats } from '../services/api';
import DepartmentAnalytics from '../components/DepartmentAnalytics';
import CallQualityAnalytics from '../components/CallQualityAnalytics';

export default function MainPage() {
  const [profile, setProfile] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getProfile().then(setProfile);
    getEmployeeStats().then(setEmployees);
  }, []);

  return (
    <div className={styles.mainWrapper}>
      <h1 className={styles.title}>Аналитика по отделу</h1>
      <div className={styles.secondWrapper}>
        <h2 className={styles.sectionTitle}>Дашборд эффективности отдела</h2>
        {/* Компонент с графиками аналитики */}
        <DepartmentAnalytics />

        <h2 className={styles.sectionTitle}>Дашборд качества звонков</h2>
        {/* Компонент с графиками качества звонков */}
        <CallQualityAnalytics className={styles.call}/>

        <h2 className={styles.sectionTitle}>Аналитика по сотрудникам</h2>
        <div className={styles.employeeTableWrapper}>
          <div className={styles.employeeTableHeader}>
            <span>Сотрудник</span>
            <span>Рейтинг</span>
            <span>Звонки всего</span>
            <span>Сделки/План</span>
            <span>Кр. ошибки</span>
          </div>
          {employees.map(emp => (
            <div className={styles.employeeRow} key={emp.id}>
              <div className={styles.employeeCell + ' ' + styles.employeeCellName}>
                <img
                  src={emp.avatar_url ? `https://logos-backend-production.up.railway.app${emp.avatar_url}` : '/default-avatar.png'}
                  alt={emp.first_name + ' ' + emp.last_name}
                  className={styles.employeeAvatar}
                />
                <span className={styles.employeeName}>{emp.first_name} {emp.last_name}</span>
              </div>
              <div className={styles.employeeCell + ' ' + getRatingClass(emp.rating)}>
                {emp.rating ? emp.rating.toString().replace('.', ',') : '0'}
              </div>
              <div className={styles.employeeCell}>{emp.calls || 0}</div>
              <div className={styles.employeeCell}>{emp.deals || 0}/{emp.plan || 0}</div>
              <div className={styles.employeeCell + ' ' + getErrorClass(emp.errors)}>
                {emp.errors || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function getRatingClass(rating) {
  if (rating >= 8) return styles.ratingGreen;
  if (rating >= 7) return styles.ratingOrange;
  if (rating < 6) return styles.ratingRed;
  return styles.ratingDefault;
}

function getErrorClass(errors) {
  if (errors > 8) return styles.errorsRed;
  return styles.errorsOrange;
} 