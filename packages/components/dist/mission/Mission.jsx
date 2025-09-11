import Image from 'next/image';
import styles from './Mission.module.css';
const Mission = ({ mission }) => {
    return (<section className={styles.section}>
      <article className={styles.article}>
        <h2>{mission.title}</h2>
        <p>{mission.description}</p>
      </article>
      <Image className={styles.image} src={mission.image} priority={true} alt={mission.alt} width={280} height={280}/>
    </section>);
};
export default Mission;
