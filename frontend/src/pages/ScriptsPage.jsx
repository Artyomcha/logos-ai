import React, { useState } from 'react';
import styles from '../styles/ScriptsPage.module.css';

const ScriptsPage = () => {
  const [files, setFiles] = useState({ products: null, script: null });
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Скрипты</h2>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Файл с товарами/услугами</h4>
        <input type="file" accept=".docx,.pdf,.txt" onChange={e => setFiles(f => ({ ...f, products: e.target.files[0] }))} className={styles.input} />
        {files.products && <div className={styles.fileName}>Загружен: {files.products.name}</div>}
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Скрипт продаж</h4>
        <input type="file" accept=".docx,.pdf,.txt" onChange={e => setFiles(f => ({ ...f, script: e.target.files[0] }))} className={styles.input} />
        {files.script && <div className={styles.fileName}>Загружен: {files.script.name}</div>}
      </div>
      <button className={styles.button}>Сохранить</button>
    </div>
  );
};

export default ScriptsPage; 