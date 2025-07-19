import React, { useState } from 'react';
import ProfilePage from './ProfilePage';
import ReportsPage from './ReportsPage';
import EmployeesPage from './EmployeesPage';
import ScriptsPage from './ScriptsPage';
import TrainingPage from './TrainingPage';
import StatsPage from './StatsPage';
import NotificationsPage from './NotificationsPage';
import styles from '../styles/Dashboard.module.css';

const sections = {
  profile: 'Личный кабинет',
  reports: 'Отчёты',
  employees: 'Сотрудники',
  scripts: 'Скрипты',
  training: 'Обучение',
  stats: 'Статистика',
  notifications: 'Уведомления',
};

function getDateString() {
  const d = new Date();
  const days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  return `${d.toLocaleDateString('ru-RU')}\n${days[d.getDay()]}`;
}

const Dashboard = ({ role, onLogout }) => {
  const [section, setSection] = useState('profile');
  const [notifCount] = useState(3); // пример

  // Разделы для сотрудника и руководителя
  const nav = [
    { key: 'profile', label: sections.profile },
    ...(role === 'manager' ? [
      { key: 'reports', label: sections.reports },
      { key: 'employees', label: sections.employees },
      { key: 'scripts', label: sections.scripts },
    ] : []),
    ...(role === 'employee' ? [
      { key: 'training', label: sections.training },
      { key: 'stats', label: sections.stats },
    ] : []),
  ];

  let content = null;
  if (section === 'profile') content = <ProfilePage />;
  else if (section === 'reports') content = <ReportsPage />;
  else if (section === 'employees') content = <EmployeesPage />;
  else if (section === 'scripts') content = <ScriptsPage />;
  else if (section === 'training') content = <TrainingPage />;
  else if (section === 'stats') content = <StatsPage />;
  else if (section === 'notifications') content = <NotificationsPage role={role} />;

  return (
    <div className={styles.dashboard}>
      {/* Левое меню */}
      <nav className={styles.nav}>
        <div className={styles.logoBlock}>
          {/* Логотип */}
          <div className={styles.logo}>W</div>
          <div className={styles.logoText}>LOGOS <span style={{ color: '#00e0d3' }}>AI</span></div>
          <div className={styles.logoSub}>Аналитическая система</div>
        </div>
        <div className={styles.menu}>
          {nav.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={styles.menuButton + (section === item.key ? ' ' + styles.menuButtonActive : '')}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button onClick={onLogout} className={styles.logout}>Выйти</button>
      </nav>
      {/* Правая часть */}
      <div className={styles.main}>
        {/* Верхняя панель */}
        <div className={styles.topBar}>
          <div className={styles.date}>{getDateString()}</div>
          <button
            onClick={() => setSection('notifications')}
            className={styles.notifButton}
          >
            Уведомления
            {notifCount > 0 && (
              <span className={styles.notifCount}>
                {notifCount}
              </span>
            )}
          </button>
        </div>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default Dashboard; 