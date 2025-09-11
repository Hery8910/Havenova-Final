// components/blog/BlogTableSkeleton.tsx
import styles from './BlogTableSkeleton.module.css';
export default function BlogTableSkeleton() {
    return (<ul className={styles.tableList}>
      <li className={styles.headerRow}>
        <span>Name</span>
        <span>Created at</span>
        <span>Comments</span>
        <span>Status</span>
        <span></span>
      </li>
    </ul>);
}
