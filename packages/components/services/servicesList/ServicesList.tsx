import styles from './ServicesList.module.css';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';
// import ServiceListSkeleton from './ServiceList.skeleton';

export interface ServiceListItem {
  title: string;
  description: string;
  icon: string; // usado también como ID o slug
  cta: string;
}

export interface ServiceListProps {
  items: ServiceListItem[];
  onClick: (service: string) => void;
  exclude?: string;
}

const ServiceList: React.FC<ServiceListProps> = ({ items, onClick, exclude = '' }) => {
  // if (!items) return <ServiceListSkeleton />;

  const filteredItems = exclude ? items.filter((item) => item.icon !== exclude) : items;

  return (
    <ul className={styles.ul}>
      {filteredItems.map((item, index) => (
        <li
          key={index}
          className={`${styles.card} card`}
          aria-label={`Service: ${item.title}`}
          onClick={() => onClick(item.icon)}
        >
          <h3 className={styles.title}>{item.title}</h3>
          <Image
            className={styles.icon}
            src={`/svg/${item.icon}.svg`}
            alt={item.title}
            width={150}
            height={150}
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <p className={styles.text}>{item.description}</p>
          <p className={styles.cta}>
            {item.cta} <IoIosArrowForward />
          </p>
        </li>
      ))}
    </ul>
  );
};

export default ServiceList;
