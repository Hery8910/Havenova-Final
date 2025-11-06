import { IoArrowRedoOutline } from 'react-icons/io5';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { PiFolderSimpleStar } from 'react-icons/pi';
import styles from './RequestStatus.module.css';
import { ServiceStatus } from '../../../../../types';

interface RequestStatusProps {
  status: ServiceStatus;
  label: string;
}

export default function RequestStatus({ status, label }: RequestStatusProps) {
  let icon: JSX.Element | null = null;

  switch (status) {
    case 'submitted':
      icon = <IoArrowRedoOutline />;
      break;
    case 'accepted':
      icon = <FaCheckCircle />;
      break;
    case 'in progress':
      icon = <FaSpinner />;
      break;
    case 'completed':
      icon = <PiFolderSimpleStar />;
      break;
    case 'cancelled':
      icon = <MdOutlineCancel />;
      break;
    default:
      icon = null;
  }

  return (
    <p className={`${styles.status} ${styles[status.replace(' ', '-')]}`}>
      {icon}
      <span>{label}</span>
    </p>
  );
}
