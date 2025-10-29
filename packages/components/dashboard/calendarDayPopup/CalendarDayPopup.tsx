import { Slot } from '../../../utils/calendar/calendarUtils';
import styles from './CalendarDayPopup.module.css';

interface CalendarDayPopupProps {
  date: string;
  slots: Slot[];
  onClose: () => void;
  onSelectSlot?: (slot: Slot) => void;
}

const CalendarDayPopup: React.FC<CalendarDayPopupProps> = ({
  date,
  slots,
  onClose,
  onSelectSlot,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <header className={styles.header}>
          <h3>{formattedDate}</h3>
          <button onClick={onClose} className={styles.close}>
            ✕
          </button>
        </header>
        <div className={styles.content}>
          {slots.length === 0 ? (
            <p>Keine verfügbaren Zeitfenster</p>
          ) : (
            <ul className={styles.slotList}>
              {slots.map((slot, index) => (
                <li
                  key={index}
                  className={`${styles.slot} ${slot.available ? styles.free : styles.blocked}`}
                  onClick={() => slot.available && onSelectSlot?.(slot)}
                >
                  {slot.start} – {slot.end}{' '}
                  {!slot.available && slot.reason && (
                    <span className={styles.reason}>({slot.reason})</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayPopup;
