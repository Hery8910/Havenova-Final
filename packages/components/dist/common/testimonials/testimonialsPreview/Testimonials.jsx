// src/components/Testimonials.tsx
import Link from 'next/link';
import ReviewStars from '../reviewStars/ReviewStars';
import styles from './Testimonials.module.css';
const Testimonials = ({ title, subtitle, description, items, cta, mobile, }) => {
    const num = mobile ? 4 : 6;
    return (<section className={styles.section1} aria-labelledby="testimonials-title">
      <header>
        <h2 id="testimonials-title">{title}</h2>
        <h3 className={styles.h3} id="testimonials-subtitle">
          {subtitle}
        </h3>
      </header>
      <ul className={styles.ul}>
        {items.slice(0, num).map((item) => (<li className={`${styles.li} card`} key={item.id}>
            <header className={styles.header_li} aria-label={`Rezension von ${item.author}`}>
              <div className={styles.name_div}>
                <time className={styles.section} dateTime={new Date(item.date).toISOString()}>
                  Bewertet am {new Date(item.date).toLocaleDateString()}
                </time>
                <h4 className={styles.section}>{item.author}</h4>
              </div>
              <div className={styles.rating_div}>
                <ReviewStars rating={item.rating}/>
                <p className={styles.section}>{item.rating}/5</p>
              </div>
            </header>
            <p className={styles.section}>{item.text}</p>
            {item.reply && (<footer className={styles.section}>
                <p className={styles.section}>Antwort</p>
                <p className={styles.section}>{item.reply.text}</p>
              </footer>)}
          </li>))}
      </ul>
      <aside className={styles.section}>
        <p className={styles.section}>{description}</p>
        <Link href={cta.href} className="button" aria-label={`${cta.label} – gehe zu ${cta.href}`}>
          {cta.label}
        </Link>
      </aside>
    </section>);
};
export default Testimonials;
