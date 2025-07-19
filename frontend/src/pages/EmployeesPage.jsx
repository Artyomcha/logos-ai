import React, { useState } from 'react';
import styles from '../styles/EmployeesPage.module.css';

const employees = [
  { id: 1, name: 'Иванов И.', rating: 4.7, position: 'Менеджер', photo: '', stats: { calls: 34, deals: 12 } },
  { id: 2, name: 'Петрова А.', rating: 4.2, position: 'Специалист', photo: '', stats: { calls: 28, deals: 9 } },
];

const EmployeeProfile = ({ employee, onBack }) => (
  <div className={styles.profileContainer}>
    <button onClick={onBack} className={styles.backButton}>&larr; Назад</button>
    <h3 className={styles.profileTitle}>{employee.name}</h3>
    <div className={styles.profileInfo}>Должность: <b>{employee.position}</b></div>
    <div className={styles.profileInfo}>Рейтинг: <b>{employee.rating}</b></div>
    <div className={styles.profileInfo}>Звонков: <b>{employee.stats.calls}</b></div>
    <div className={styles.profileInfo}>Сделок: <b>{employee.stats.deals}</b></div>
    <div style={{ marginTop: 24, color: '#888', fontSize: 16 }}>[Здесь будет фото и подробная статистика]</div>
  </div>
);

const EmployeesPage = () => {
  const [selected, setSelected] = useState(null);
  if (selected) return <EmployeeProfile employee={selected} onBack={() => setSelected(null)} />;
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Сотрудники</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>ФИО</th>
            <th className={styles.th}>Должность</th>
            <th className={styles.th}>Рейтинг</th>
            <th className={styles.th}>Подробнее</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className={styles.tr}>
              <td className={styles.td}>{emp.name}</td>
              <td className={styles.td}>{emp.position}</td>
              <td className={styles.td}>{emp.rating}</td>
              <td className={styles.td}>
                <button onClick={() => setSelected(emp)} className={styles.button}>Профиль</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesPage; 