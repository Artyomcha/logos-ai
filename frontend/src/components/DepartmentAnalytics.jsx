import React, { useState, useEffect } from 'react';
import { getDepartmentAnalytics } from '../services/api';
import styles from '../styles/DepartmentAnalytics.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DepartmentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка аналитики...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!analytics) return <div>Нет данных</div>;

  // Данные для графика 1: Общее число звонков с трендом
  const totalCallsData = {
    labels: ['Общее число звонков'],
    datasets: [
      {
        label: 'Звонки',
        data: [analytics.totalCalls.total],
        backgroundColor: '#1C85FF',
        borderColor: '#1C85FF',
        borderWidth: 1,
      },
    ],
  };

  // Данные для графика 2: Средняя длительность звонка по дням с трендом
  const callDurationData = {
    labels: analytics.callDuration.data.map(item => 
      new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    ),
    datasets: [
      {
        label: 'Тренд',
        data: analytics.callDuration.data.map(item => item.duration),
        borderColor: '#FF00FF',
        backgroundColor: '#FF00FF',
        borderWidth: 2,
        pointBackgroundColor: '#FF00FF',
        pointBorderColor: '#FF00FF',
        pointRadius: 6,
        pointHoverRadius: 12,
        type: 'line',
        fill: false,
        tension: 0,
        yAxisID: 'y',
        order: 1,
      },
      {
        label: 'Средняя длительность (сек)',
        data: analytics.callDuration.data.map(item => item.duration),
        backgroundColor: '#FFDD03',
        borderColor: '#FFDD03',
        borderWidth: 0,
        type: 'bar',
        barThickness: 30,
        order: 2,
      },
    ],
  };

  // Данные для графика 3: Кольцевая диаграмма успешных звонков
  const successfulCallsData = {
    labels: ['Успешные', 'Неуспешные'],
    datasets: [
      {
        data: [
          analytics.successfulCalls.successful,
          analytics.successfulCalls.total - analytics.successfulCalls.successful
        ],
        backgroundColor: [
          '#0ED365',
          '#FF5501',
        ],
        borderColor: [
          '#0ED365',
          '#FF5501',
        ],
        borderWidth: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#FF00FF',
        borderWidth: 1,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 6,
        hoverRadius: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className={styles.departmentAnalytics}>
      
      <div className={styles.chartsGrid}>
        {/* График 1: Общее число звонков */}
        <div className={styles.chartCard1}>
          <div className={styles.infoBlocks}>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{analytics.totalCalls.total}</div>
              <div className={styles.infoLabel}>Всего звонков</div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{Math.round(analytics.totalCalls.avgDaily)}</div>
              <div className={styles.infoLabel}>В среднем в день</div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoNumber}>{analytics.totalCalls.trend === 'up' ? ' Растет 📈' : 'Падает 📉 '}</div>
              <div className={styles.infoLabel}>Тренд</div>
            </div>
          </div>
        </div>

        {/* График 2: Средняя длительность звонка */}
        <div className={styles.chartCard}>
          <h3>Средняя длительность звонка</h3>
          <div className={`${styles.chartContainer} ${styles.tall}`}>
            <Chart data={callDurationData} options={barOptions} className={styles.num2}/>
          </div>
          <div className={styles.chartInfo}>
            <p>Последние 7 дней</p>
          </div>
        </div>

        {/* График 3: Кол-во успешных звонков */}
        <div className={styles.chartCard}>
          <h3>Кол-во успешных звонков (закрытие/встреча)</h3>
          <div className={styles.chartContainer}>
            <Doughnut data={successfulCallsData} options={doughnutOptions} className={styles.doughnut}/>
          </div>
          <div className={styles.chartInfo}>
            <p>Успешных: {analytics.successfulCalls.successful}</p>
            <p>Всего: {analytics.successfulCalls.total}</p>
            <p>Процент успеха: {analytics.successfulCalls.rate}%</p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DepartmentAnalytics; 