import React, { useState, useEffect } from 'react';
import styles from '../styles/CallsPage.module.css';
import { getEmployeeCalls } from '../services/api';

export default function CallsPage({ onCallSelect }) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCalls = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeCalls();
        setCalls(data);
      } catch (err) {
        console.error('Error loading calls:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCalls();
  }, []);

  // Группируем звонки по дате
  const groupCallsByDate = (calls) => {
    const grouped = {};
    calls.forEach(call => {
      const date = new Date(call.call_date).toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(call);
    });
    return grouped;
  };

  // Извлекаем имя клиента из task_name
  const getCustomerName = (taskName) => {
    if (!taskName) return 'Неизвестно';
    // task_name формат: "Имя_Дата_Время"
    const parts = taskName.split('_');
    return parts[0] || 'Неизвестно';
  };

  // Определяем цвет для оценки (точно как на изображении)
  const getScoreColor = (score) => {
    if (!score || score === '-') return '';
    const numScore = parseFloat(score);
    if (numScore >= 80) return styles.scoreGreen;
    if (numScore >= 50) return styles.scoreOrange;
    return styles.scoreRed;
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка данных о звонках...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  const groupedCalls = groupCallsByDate(calls);

  return (
    <div className={styles.callsWrapper}>
      <h1 className={styles.title}>Информация о сотруднике</h1>
      
      {Object.entries(groupedCalls).map(([date, dateCalls]) => (
        <div key={date} className={styles.dateSection}>
          <div className={styles.dateHeader}>{date}</div>
          <div className={styles.callsList}>
            {dateCalls.map((call) => (
              <div key={call.id} className={styles.callRow}>
                <div className={styles.callTime}>
                  {new Date(call.call_date).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className={styles.customerName}>{getCustomerName(call.customer_name)}</div>
                <div className={`${styles.callScore} ${getScoreColor(call.overall_score)}`}>
                  {call.overall_score || '-'}
                </div>
                <button 
                  className={styles.detailsButton}
                  onClick={() => onCallSelect(call.id)}
                >
                  Подробнее
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedCalls).length === 0 && (
        <div className={styles.noData}>
          <p>Нет данных о звонках</p>
        </div>
      )}
    </div>
  );
}
