import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MainPage from './MainPage';
import EmployeeMainPage from './EmployeeMainPage';
import CallsPage from './CallsPage';
import CallDetailsPage from './CallDetailsPage';
import ProfilePage from './ProfilePage';
import ReportsPage from './ReportsPage';
import EmployeesPage from './EmployeesPage';
import ScriptsPage from './ScriptsPage';
import TrainingPage from './TrainingPage';
import EmployeeDetailPage from './EmployeeDetailsPage';
import styles from '../styles/Dashboard.module.css';
import { getProfile } from '../services/api';

export default function Dashboard({ role, onLogout }) {
  const [section, setSection] = useState('main');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(error.message);
      if (error.message.includes('Сессия истекла') || error.message.includes('Токен не найден')) {
        onLogout();
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, [onLogout]);

  let content = null;
  if (showProfilePage) {
    content = <ProfilePage profile={profile} setProfile={setProfile} onProfileUpdate={loadProfile} />;
  } else if (section === 'main') {
    // Для employee показываем EmployeeMainPage, для остальных - MainPage
    if (role === 'employee') {
      content = <EmployeeMainPage />;
    } else {
      content = <MainPage />;
    }
  } else if (section === 'calls') {
    // Страница звонков только для employee
    if (role === 'employee') {
      if (selectedCallId) {
        content = <CallDetailsPage callId={selectedCallId} onBack={() => setSelectedCallId(null)} />;
      } else {
        content = <CallsPage onCallSelect={setSelectedCallId} />;
      }
    }
  } else if (section === 'reports') {
    content = <ReportsPage />;
  } else if (section === 'employees') {
    content = <EmployeesPage />;
  } else if (section === 'files') {
    content = <ScriptsPage />;
  } else if (section === 'training') {
    content = <TrainingPage />;
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={onLogout}>Войти снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Topbar profile={profile} onProfileClick={() => setShowProfilePage(true)} role={role} />
      <div className={styles.body}>
        <Sidebar 
          section={section} 
          setSection={s => { setSection(s); setShowProfilePage(false); }} 
          onLogout={onLogout} 
          role={role}
        />
        <main className={styles.content}>
          {content}
        </main>
      </div>
    </div>
  );
} 