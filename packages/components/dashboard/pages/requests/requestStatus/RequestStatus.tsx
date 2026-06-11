import { IoArrowRedoOutline } from 'react-icons/io5';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { PiFolderSimpleStar } from 'react-icons/pi';
import styles from './RequestStatus.module.css';
import type { ServiceRequestStatus } from '../../../../../types';

interface RequestStatusProps {
  status: ServiceRequestStatus;
  label: string;
}

export default function RequestStatus({ status, label }: RequestStatusProps) {
  let icon: JSX.Element | null = null;

  switch (status) {
    case 'submitted':
      icon = <IoArrowRedoOutline />;
      break;
    case 'under_review':
      icon = <FaCheckCircle />;
      break;
    case 'visit_scheduled':
      icon = <FaSpinner />;
      break;
    case 'visit_completed':
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
