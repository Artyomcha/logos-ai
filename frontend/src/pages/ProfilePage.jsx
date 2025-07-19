import React, { useState } from 'react';
import styles from '../styles/ProfilePage.module.css';

const ProfilePage = ({ user = {
  firstName: 'Иван',
  lastName: 'Иванов',
  position: 'Менеджер',
  email: 'ivanov@example.com',
  role: 'manager',
} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Личный кабинет</h2>
      <div className={styles.info}>
        <b>ФИО:</b> {user.lastName} {user.firstName}<br />
        <b>Должность:</b> {user.position}<br />
        <b>Email:</b> {user.email}<br />
        <b>Роль:</b> {user.role === 'manager' ? 'Руководитель' : 'Сотрудник'}
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Сменить пароль</h4>
        <input type={showPassword ? 'text' : 'password'} placeholder="Новый пароль" className={styles.input} />
        <button onClick={() => setShowPassword(v => !v)} className={styles.button + ' ' + styles.buttonSecondary}>{showPassword ? 'Скрыть' : 'Показать'}</button>
        <button className={styles.button}>Сохранить</button>
      </div>
      <div>
        <h4 className={styles.sectionTitle}>Обратиться в техподдержку</h4>
        <textarea
          placeholder="Опишите вашу проблему..."
          value={supportMsg}
          onChange={e => setSupportMsg(e.target.value)}
          className={styles.textarea}
        />
        <br />
        <button onClick={() => { setSupportSent(true); setSupportMsg(''); }} disabled={supportMsg.length < 5} className={styles.button}>
          Отправить
        </button>
        {supportSent && <div className={styles.success}>Сообщение отправлено!</div>}
      </div>
    </div>
  );
};

export default ProfilePage; 