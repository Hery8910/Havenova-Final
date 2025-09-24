'use client';
import styles from './Values.module.css';

export interface ValuesItems {
  label: string;
  description: string;
  image: { src: string; alt: string };
}

export interface ValuesData {
  title: string;
  list: ValuesItems[];
  theme: 'light' | 'dark';
  isMobile: boolean;
}

const Values: React.FC<ValuesData> = ({ title, list, theme, isMobile }) => {
 
  return (
    <section
      className={styles.section}
      role="region"
      aria-labelledby="values-title"
    >
      <header className={styles.header}>
        <h2 id="values-title">{title}</h2>
      </header>
      <ul className={styles.ul} aria-label="Core company values">
        {list.map((item, idx) => (
          <li className={styles.li} key={idx}>
            <h3 className={styles.num}>0{idx + 1}.</h3>
            <h3 className={styles.li_h2}>{item.label}</h3>
            <p className={styles.li_p}>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Values;
