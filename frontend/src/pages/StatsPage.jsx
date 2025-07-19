import React from 'react';
import styles from '../styles/StatsPage.module.css';

const calls = [
  { id: 1, date: '2024-07-18', rating: 4, transcript: 'Здравствуйте...', audio: '', errors: ['minor'] },
  { id: 2, date: '2024-07-17', rating: 2, transcript: 'Добрый день...', audio: '', errors: ['major'] },
];

const StatsPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Статистика</h2>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Последние звонки</h4>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Дата</th>
              <th className={styles.th}>Рейтинг</th>
              <th className={styles.th}>Текст</th>
              <th className={styles.th}>Аудио</th>
              <th className={styles.th}>Ошибки</th>
              <th className={styles.th}>Оспорить</th>
            </tr>
          </thead>
          <tbody>
            {calls.map(call => (
              <tr key={call.id} className={styles.tr}>
                <td className={styles.td}>{call.date}</td>
                <td className={styles.td}>{call.rating}</td>
                <td className={styles.td}>{call.transcript.slice(0, 20)}...</td>
                <td className={styles.td}>[Аудио]</td>
                <td className={styles.td} style={{ color: call.errors.includes('major') ? 'red' : call.errors.includes('minor') ? 'orange' : 'inherit' }}>
                  {call.errors.includes('major') ? 'Критическая' : call.errors.includes('minor') ? 'Мелкая' : '—'}
                </td>
                <td className={styles.td}><button className={styles.button}>Оспорить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Краткая статистика</h4>
        <ul className={styles.statsList}>
          <li>Всего сделок: <b>21</b></li>
          <li>Средний чек: <b>13 000 ₽</b></li>
          <li>План продаж: <b>80%</b></li>
          <li>Соответствие плану: <b>90%</b></li>
        </ul>
      </div>
    </div>
  );
};

export default StatsPage; 