import React from "react";
import styles from './styles.module.css';

const SuccessPage = () => {
  
  const onClick = (e) => {
    window.location.replace('http://localhost:3000')
  }

  return <div className={styles.success}>
    <h1 className={styles.success_h1}>Success!</h1>
    <button className={styles.success_btn} onClick={onClick}>go back</button>
  </div>;
}

export default SuccessPage;