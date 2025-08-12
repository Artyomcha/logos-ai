import React, { useState, useEffect } from 'react';
import { getCallDetails } from '../services/api';
import styles from '../styles/CallDetailsPage.module.css';

const CallDetailsPage = ({ callId, onBack }) => {
  const [callDetails, setCallDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setLoading(true);
        console.log('CallDetailsPage - fetching details for callId:', callId);
        const data = await getCallDetails(callId);
        console.log('CallDetailsPage - received data:', data);
        setCallDetails(data);
        
        // Устанавливаем URL аудио если он есть
        if (data.audio_url) {
          setAudioUrl(data.audio_url);
        }
      } catch (err) {
        console.error('CallDetailsPage - Error fetching call details:', err);
        setError('Ошибка загрузки деталей звонка: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (callId) {
      fetchCallDetails();
    }
  }, [callId]);

  // Обработчик окончания воспроизведения аудио
  useEffect(() => {
    if (window.audioPlayer) {
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      window.audioPlayer.addEventListener('ended', handleEnded);
      
      return () => {
        window.audioPlayer.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const getScoreColor = (score) => {
    if (!score || score === '-') return '';
    const numScore = parseFloat(score);
    if (numScore >= 80) return styles.scoreGreen;
    if (numScore >= 50) return styles.scoreOrange;
    return styles.scoreRed;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Функции для работы с аудио
  const handlePlayAudio = () => {
    if (!audioUrl) {
      // Создаем моковый аудио URL для демонстрации
      const mockAudioUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      setAudioUrl(mockAudioUrl);
    }
    
    setIsPlaying(!isPlaying);
    
    // Создаем аудио элемент для воспроизведения
    if (!window.audioPlayer) {
      window.audioPlayer = new Audio();
    }
    
    if (isPlaying) {
      // Останавливаем воспроизведение
      window.audioPlayer.pause();
      window.audioPlayer.currentTime = 0;
    } else {
      // Начинаем воспроизведение
      window.audioPlayer.src = audioUrl;
      window.audioPlayer.play().catch(e => {
        console.log('Audio play failed:', e);
        // Если реальный аудио не работает, показываем уведомление
        alert('Аудио файл недоступен для воспроизведения');
      });
    }
    
    console.log('Audio play/pause:', !isPlaying);
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `call_${callId}_${formatDate(callDetails?.recorded_at)}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Создаем моковый файл для скачивания
      const mockAudioBlob = new Blob(['Mock audio data'], { type: 'audio/wav' });
      const url = URL.createObjectURL(mockAudioBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `call_${callId}_${formatDate(callDetails?.recorded_at)}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    console.log('Audio download initiated');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка деталей звонка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!callDetails) {
    return (
      <div className={styles.error}>
        <p>Детали звонка не найдены</p>
      </div>
    );
  }

  return (
    <div className={styles.callDetailsWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Подробнее о звонке</h1>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          Назад
        </button>
      </div>

      <div className={styles.infoCards}>
        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Время / дата</div>
          <div className={styles.cardValue}>
            <div>{formatTime(callDetails.recorded_at)}</div>
            <div>{formatDate(callDetails.recorded_at)}</div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Клиент</div>
          <div className={styles.cardValue}>
            {callDetails.customer_name || 'Не указан'}
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardLabel}>Рейтинг</div>
          <div className={`${styles.cardValue} ${getScoreColor(callDetails.overall_score)}`}>
            {callDetails.overall_score || '-'}
          </div>
        </div>
      </div>

      <div className={styles.recordingSection}>
        <div className={styles.recordingHeader}>
          <span>Запись звонка</span>
          <div className={styles.recordingControls}>
            <span className={styles.duration}>0:21</span>
            <button 
              className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
              onClick={handlePlayAudio}
            >
              <span className={styles.playIcon}>
                {isPlaying ? '⏸' : '▶'}
              </span>
            </button>
            <button 
              className={styles.downloadButton}
              onClick={handleDownloadAudio}
            >
              <span className={styles.downloadIcon}>⬇</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.transcriptSection}>
        <h2 className={styles.transcriptTitle}>Текст звонка</h2>
        <div className={styles.transcriptBox}>
          {callDetails.transcript ? (
            <div className={styles.transcriptContent}>
              {callDetails.transcript.map((message, index) => (
                <div key={index} className={styles.message}>
                  {message.speaker === 'dialogue' ? (
                    <div className={styles.fullDialogue}>
                      <div className={styles.dialogueTitle}>Полный диалог:</div>
                      <div className={styles.dialogueText}>
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.speaker}>
                        {message.speaker === 'employee' ? 'Алексей:' : 'Клиент:'}
                      </div>
                      <div className={styles.messageText}>
                        {message.text}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noTranscript}>
              <p>Транскрипт звонка недоступен</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetailsPage;
