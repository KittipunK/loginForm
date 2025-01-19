import React from "react";
import styles from './styles.module.css';

export default function input_field({name:name, src:src, type: type, func:func}) {

  const handleChange = (e: any) => {
    func(e.target.name, e.target.value);
  }

  return <div className={styles.container}>
    <img src={src} alt=""/>
    <input name={name} onChange={handleChange} className={styles.input_field} type={type} placeholder={name} />
  </div>;
}
