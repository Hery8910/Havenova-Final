import styles from './Map.module.css';

interface MapProps {
  title: string;
  subtitle: string;
  address: string;
}

export function Map({ title, subtitle, address }: MapProps) {
  const embedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.0975013159614!2d13.601517577304527!3d52.53167007206437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84a3212d70ec7%3A0xa0734b5eed34a2a7!2sStollberger%20Str.%2043%2C%2012627%20Berlin!5e0!3m2!1ses!2sde!4v1759305046104!5m2!1ses!2sde';
  return (
    <section className={styles.mapWrapper}>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <iframe
        src={embedUrl}
        width="100%"
        height="400"
        className={styles.map}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {address && <p>{address}</p>}
    </section>
  );
}
