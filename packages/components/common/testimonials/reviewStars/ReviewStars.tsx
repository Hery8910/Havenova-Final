// src/components/ReviewStars.tsx
import styles from './ReviewStars.module.css';

export interface ReviewStarsProps {
  rating: number; // 0–5
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ rating }) => {
  const totalStars = 5;
  const clampedRating = Math.max(0, Math.min(rating, totalStars));
  const percentage = (clampedRating / totalStars) * 100;

  return (
    <div
      className={styles.div_stars}
      role="img"
      aria-label={`Valoración: ${clampedRating} de 5 estrellas`}
    >
      {/* Fondo gris (estrellas vacías) */}
      <div className={styles.div_gray} aria-hidden="true">
        {Array.from({ length: totalStars }).map((_, index) => (
          <Star key={`gray-${index}`} className={styles.svg_gray} />
        ))}
      </div>

      {/* Capa amarilla (estrellas rellenas) */}
      <div className={styles.div_yellow} style={{ width: `${percentage}%` }} aria-hidden="true">
        {Array.from({ length: totalStars }).map((_, index) => (
          <Star key={`yellow-${index}`} className={styles.svg_yellow} />
        ))}
      </div>
    </div>
  );
};

export default ReviewStars;

// Icono SVG separado (reutilizable, accesible)
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="inherit"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
             9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);
