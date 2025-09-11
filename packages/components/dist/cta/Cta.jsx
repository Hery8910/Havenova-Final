import Link from 'next/link';
import styles from './Cta.module.css';
import Image from 'next/image';
const Cta = ({ cta }) => {
    return (<section className={styles.section}>
      <article className={styles.article}>
        <h2>{cta.title}</h2>
        <p>{cta.description}</p>
        <Link className="button" href={cta.link}>
          {cta.cta}
        </Link>
      </article>
      <Image className={styles.image} src={cta.image} priority={true} alt={cta.alt} width={280} height={280}/>
    </section>);
};
export default Cta;
