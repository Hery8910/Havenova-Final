import styles from './DashboardHeader.module.css';
export default function DashboardHeader() {
    return (<>
      <h1 className={styles.header}>Dashboard</h1>
      <div>
        <span className={styles.header}>Mi Empresa</span>
      </div>
    </>);
}
