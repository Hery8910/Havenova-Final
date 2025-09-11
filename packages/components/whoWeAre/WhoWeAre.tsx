import Image from 'next/image';
import styles from './WhoWeAre.module.css';

interface WeAreItem {
  title: string;
  description: string;
}

interface WeAre {
  title: string;
  description: string;
  list: WeAreItem[];
}

interface WhoWeAreProps {
  weAre: WeAre;
}

const WhoWeAre = ({ weAre }: WhoWeAreProps) => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>{weAre.title}</h2>
        <p>{weAre.description}</p>
      </header>
      <ul className={styles.ul}>
        {weAre.list.map((elem, index) => (
          <li key={index} className={styles.li}>
            {elem.title && <p className={styles.title_p}>{elem.title}</p>}
            <p className={`${styles.description_p} card`}>
              {elem.description}{' '}
              <Image
                className={styles.image}
                src="/svg/check.svg"
                priority={true}
                alt="Check icon"
                width={30}
                height={30}
              />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhoWeAre;
