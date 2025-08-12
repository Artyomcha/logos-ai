import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/ProfilePage.module.css';
import { getProfile, changePassword, setNewPassword, uploadAvatar, deleteAccount } from '../services/api';

export default function ProfilePage({ profile, setProfile }) {
  const [editPassword, setEditPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setProfile(data);
      
      // Проверяем, является ли пользователь новым (создан менее 24 часов назад)
      if (data.createdAt) {
        const createdAt = new Date(data.createdAt);
        const now = new Date();
        const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
        setIsNewUser(hoursDiff < 24);
      }
    })();
  }, []);

  const handleAvatarChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    setAvatarLoading(true);
    try {
      const url = await uploadAvatar(e.target.files[0]);
      console.log('Avatar uploaded, new URL:', url);
      // Важно: обновляем глобальный profile!
      setProfile({ ...profile, avatarUrl: url });
      console.log('Profile updated with new avatar URL');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Ошибка загрузки аватара: ' + error.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (isNewUser) {
      await setNewPassword(newPassword);
    } else {
    await changePassword(newPassword);
    }
    setPasswordChanged(true);
    setEditPassword(false);
    setNewPassword('');
    setIsNewUser(false); // Больше не новый пользователь
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Вы уверены, что хотите удалить учетную запись? Это действие необратимо.')) {
      try {
        await deleteAccount();
        window.location.reload(); // или вызвать onLogout, если есть
      } catch (e) {
        alert(e.message);
      }
    }
  };

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div className={styles.profileFull}>
      {isNewUser && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <strong>Добро пожаловать!</strong> Рекомендуется сменить пароль после первого входа в систему.
        </div>
      )}
      <div className={styles.profileContent}>
        <div className={styles.avatarBlock}>
          <img
            src={profile?.avatarUrl ? `https://logos-backend-production.up.railway.app${profile.avatarUrl}` : '/default-avatar.png'}
            alt="avatar"
            className={styles.avatar}
          />
          <button className={styles.link} onClick={() => fileInputRef.current.click()} disabled={avatarLoading}>
            {avatarLoading ? 'Загрузка...' : 'Изменить фото профиля'}
          </button>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleAvatarChange} />
        </div>
        <div className={styles.infoBlock}>
          <div className={styles.label}>Имя пользователя:</div>
          <div className={styles.value}>{profile.lastName} {profile.firstName}</div>
          <div className={styles.label}>Логин:</div>
          <div className={styles.value}>{profile.email}</div>
          <div className={styles.label}>Пароль:</div>
          <div className={styles.value}>
            {'*'.repeat(12)}{' '}
            <span className={styles.link} onClick={() => setEditPassword(true)}>
              {isNewUser ? 'Установить пароль' : 'Изменить пароль'}
            </span>
          </div>
          {editPassword && (
            <div className={styles.passwordEdit}>
              <input
                type="password"
              placeholder={isNewUser ? "Установить новый пароль" : "Новый пароль"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={styles.input}
              />
              <button className={styles.button} onClick={handleChangePassword} disabled={!newPassword}>Сохранить</button>
            </div>
          )}
          {passwordChanged && <div className={styles.success}>Пароль успешно изменён!</div>}
          <div className={styles.label}>Должность:</div>
          <div className={styles.value}>{profile.role === 'manager' ? 'Руководитель отдела продаж' : profile.role === 'employee' ? 'Сотрудник' : profile.role}</div>
          <button className={styles.danger} onClick={handleDeleteAccount}>Удалить учетную запись</button>
          <button
            className={styles.button}
            onClick={() => window.open('https://t.me/logosai_support_bot', '_blank', 'noopener,noreferrer')}
            type="button"
          >
            Техническая поддержка
          </button>
          <div className={styles.version}>Версия приложения 1.0.0</div>
        </div>
      </div>
    </div>
  );
} 