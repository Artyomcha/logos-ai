import React from 'react';
import styles from '../styles/NotificationsPage.module.css';

const notifications = [
  { id: 1, text: 'Необходимо пройти обучающий кейс', role: 'employee', type: 'training' },
  { id: 2, text: 'Спорная ситуация в оценке работы', role: 'manager', type: 'dispute' },
  { id: 3, text: 'Отчёт за период готов', role: 'manager', type: 'report' },
  { id: 4, text: 'Критическое нарушение у сотрудника', role: 'manager', type: 'critical' },
];

const NotificationsPage = ({ role }) => {
  const filtered = notifications.filter(n => n.role === role || n.role === 'all');
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Уведомления</h2>
      <ul className={styles.list}>
        {filtered.map(n => (
          <li key={n.id} className={
            styles.item + ' ' +
            (n.type === 'critical' ? styles.critical : n.type === 'dispute' ? styles.dispute : styles.default)
          }>
            {n.text}
          </li>
        ))}
        {filtered.length === 0 && <li className={styles.noNotifications}>Нет новых уведомлений</li>}
      </ul>
    </div>
  );
};

export default NotificationsPage; 