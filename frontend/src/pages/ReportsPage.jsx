import React, { useEffect, useState } from 'react';
import styles from '../styles/ReportsPage.module.css';
import { getReports, getProfile } from '../services/api';

function groupReportsByMonth(reports) {
  return reports.reduce((acc, report) => {
    const date = new Date(report.report_date);
    const month = date.toLocaleString('ru', { month: 'long' });
    const year = date.getFullYear();
    const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(report);
    return acc;
  }, {});
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getReports().then(setReports);
    getProfile().then(setProfile);
  }, []);

  const grouped = groupReportsByMonth(reports);

  // Если сотрудник — показываем плейсхолдер, если нет отчётов
  if (profile && profile.role === 'employee') {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Доступные отчёты</h1>
        <div className={styles.placeholder}>
          У вас пока нет доступных отчётов.<br />
          Обратитесь к вашему руководителю для получения информации о работе отдела.
        </div>
      </div>
    );
  }

  // Для всех — только просмотр отчётов
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Доступные отчёты</h1>
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className={styles.monthBlock}>
          <div className={styles.month}>{month}</div>
          {items.map(report => (
            <div className={styles.reportRow} key={report.id}>
              <span className={styles.reportTitle}>{report.title}</span>
              <div className={styles.iconGroup}>
                <a
                  href={`https://logos-backend-production.up.railway.app${report.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconBtn}
                  title="Просмотреть"
                >
                  {/* глаз */}
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                </a>
                <a
                  href={`https://logos-backend-production.up.railway.app${report.file_url}`}
                  download
                  className={styles.iconBtn}
                  title="Скачать"
                >
                  {/* download */}
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 16a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1zm-4.707-3.707a1 1 0 0 1 1.414 0L12 15.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414zM5 20a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
} 