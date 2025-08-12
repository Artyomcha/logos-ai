import React, { useState, useEffect } from 'react';
import { getCallQualityAnalytics } from '../services/api';
import styles from '../styles/CallQualityAnalytics.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CallQualityAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getCallQualityAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка аналитики качества...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!analytics) return <div>Нет данных</div>;

  // Данные для графика 1: Соблюдение скрипта
  const scriptComplianceData = {
    labels: ['Соблюдение скрипта'],
    datasets: [
      {
        label: 'Процент соблюдения',
        data: [analytics.scriptCompliance.avgCompliance],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Данные для графика 2: Частота пропусков по блокам (стекированная гистограмма)
  const stageComplianceData = {
    labels: analytics.stageCompliance.data.map(item => 
      new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    ),
    datasets: [
      {
        label: 'Выполненные этапы (%)',
        data: analytics.stageCompliance.data.map(item => item.completionRate),
        backgroundColor: '#1C85FF',
        borderColor: '#1C85FF',
        borderWidth: 1,
      },
      {
        label: 'Пропущенные этапы (%)',
        data: analytics.stageCompliance.data.map(item => 100 - item.completionRate),
        backgroundColor: '#F4037A',
        borderColor: '#F4037A',
        borderWidth: 1,
      },
    ],
  };

  // Данные для графика 3: Использование ключевых фраз
  const keyPhrasesData = {
    labels: analytics.keyPhrases.managers.map(manager => manager.name),
    datasets: [
      {
        label: 'Среднее количество ключевых фраз',
        data: analytics.keyPhrases.managers.map(manager => manager.avgPhrases),
        backgroundColor: '#0ED365',
        borderColor: '#0ED365',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
    },
    layout: {
      padding: {
        top: 20
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  return (
    <div className={styles.callQualityAnalytics}>
      
      <div className={styles.chartsGrid}>
        {/* График 1: Соблюдение скрипта */}
        <div className={styles.chartCard1}>
          <div className={styles.infoBlocks}>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{analytics.scriptCompliance.avgCompliance}%</div>
              <div className={styles.infoLabel}>Соблюдение скрипта</div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{analytics.scriptCompliance.perfectCalls}</div>
              <div className={styles.infoLabel}>Идеальных звонков</div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{analytics.scriptCompliance.totalCalls}</div>
              <div className={styles.infoLabel}>Всего звонков</div>
            </div>
          </div>
        </div>

        {/* График 2: Частота пропусков по блокам */}
        <div className={styles.chartCard}>
          <h3>Частота пропусков по блокам</h3>
          <div className={styles.chartContainer}>
            <Bar data={stageComplianceData} options={stackedBarOptions} />
          </div>
          <div className={styles.chartInfo}>
            <p>Последние 7 дней</p>
          </div>
        </div>

        {/* График 3: Использование ключевых фраз */}
        <div className={styles.chartCard}>
          <h3>Использование ключевых фраз</h3>
          <div className={styles.chartContainer}>
            <Bar data={keyPhrasesData} options={barOptions} />
          </div>
          <div className={styles.chartInfo}>
            <p>По менеджерам</p>
          </div>
        </div>
      </div>

      {/* Таблица запрещенных фраз */}
      <div className={styles.chartCard2}>
        <h3>Запрещённые фразы - Инциденты</h3>
        <div className={styles.tableContainer}>
          <table className={styles.incidentsTable}>
            <thead>
              <tr>
                <th>Менеджер</th>
                <th>Количество инцидентов</th>
                <th>Статус</th>
                <th>Фразы</th>
              </tr>
            </thead>
            <tbody>
              {analytics.forbiddenPhrases.incidents.map((incident, index) => (
                <tr key={index}>
                  <td>{incident.name}</td>
                  <td>{incident.count}</td>
                  <td>
                    <span className={`${styles.status} ${
                      incident.count === 0 ? styles.green :
                      incident.count <= 2 ? styles.yellow : styles.red
                    }`}>
                      {incident.count === 0 ? '🟢 Хорошо' :
                       incident.count <= 2 ? '🟡 Внимание' : '🔴 Критично'}
                    </span>
                  </td>
                  <td className={styles.phrasesCell}>
                    {incident.phrases || 'Нет данных'}
                  </td>
                </tr>
              ))}
              {analytics.forbiddenPhrases.incidents.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    Нет инцидентов с запрещенными фразами
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CallQualityAnalytics; 