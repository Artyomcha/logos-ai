import React, { useState } from 'react';
import styles from '../styles/TrainingPage.module.css';

const cases = [
  { id: 1, topic: 'Отработка возражений о стоимости', passed: false },
  { id: 2, topic: 'Работа с сомнениями клиента', passed: true },
];

const TrainingPage = () => {
  const [activeCase, setActiveCase] = useState(null);
  const [score, setScore] = useState('');
  const [recommend, setRecommend] = useState('');
  const [done, setDone] = useState(false);

  if (activeCase) {
    return (
      <div className={styles.container}>
        <button onClick={() => setActiveCase(null)} className={styles.backButton}>&larr; Назад</button>
        <h3 className={styles.sectionTitle}>Кейс: {activeCase.topic}</h3>
        <div className={styles.agent}>[Голосовой ИИ-агент: диалоговая симуляция]</div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 18 }}>Оцените разговор: </label>
          <select value={score} onChange={e => setScore(e.target.value)} className={styles.select}>
            <option value="">Выберите</option>
            <option value="5">Отлично</option>
            <option value="4">Хорошо</option>
            <option value="3">Удовлетворительно</option>
            <option value="2">Плохо</option>
            <option value="1">Очень плохо</option>
          </select>
        </div>
        <textarea
          placeholder="Рекомендации по улучшению..."
          value={recommend}
          onChange={e => setRecommend(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={() => setDone(true)} disabled={!score} className={styles.sendButton}>Отправить</button>
        {done && (
          <div className={styles.result} style={{ color: score < 3 ? 'red' : 'green' }}>
            {score < 3 ? 'Рекомендуется пройти кейс заново.' : 'Спасибо за прохождение!'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Обучение</h2>
      <ul className={styles.caseList}>
        {cases.map(c => (
          <li key={c.id} className={styles.caseItem}>
            <b>{c.topic}</b>
            <span className={styles.caseStatus} style={{ color: c.passed ? 'green' : 'orange' }}>
              {c.passed ? 'Пройден' : 'Требует прохождения'}
            </span>
            <button onClick={() => { setActiveCase(c); setDone(false); setScore(''); setRecommend(''); }} className={styles.button}>
              Запустить кейс
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingPage; 