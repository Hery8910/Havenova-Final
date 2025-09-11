'use client';
import { useState } from 'react';
import CreateWorkerForm from '../../../../packages/components/dashboard/createWorkerForm/CreateWorkerForm';
import { DashboardNav } from '../../../../packages/components/dashboardNav/DashboardNav';
import styles from './page.module.css';

const Employees = () => {
  const [selected, setSelected] = useState<string>('');
  return (
    <main className={styles.main}>
      <DashboardNav
        tabs={['Trabajadores', 'Calendario', 'Reportes']}
        selected={selected}
        onSelect={(tab) => setSelected(tab)}
      />
      <h1>Employees</h1>
      <CreateWorkerForm />
    </main>
  );
};

export default Employees;
