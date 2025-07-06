import styles from './Title.module.css';

const Title = ({ children, variant = 'default' }) => {
  return (
    <div className={`${styles.titleContainer} ${styles[variant]}`}>
      <h2 className={styles.title}>{children}</h2>
      <div className={styles.titleUnderline}></div>
      {variant === 'featured' && (
        <div className={styles.sparkles}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.sparkle}>⭐</span>
          <span className={styles.sparkle}>💫</span>
          <span className={styles.sparkle}>🌟</span>
        </div>
      )}
      {variant === 'categories' && (
        <div className={styles.categoryIcons}>
          <span className={styles.categoryIcon}>📱</span>
          <span className={styles.categoryIcon}>💻</span>
          <span className={styles.categoryIcon}>🎧</span>
          <span className={styles.categoryIcon}>📺</span>
        </div>
      )}
    </div>
  );
};

export default Title;