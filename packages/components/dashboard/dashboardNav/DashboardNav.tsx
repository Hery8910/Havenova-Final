import React from 'react';
import styles from './DashboardNav.module.css';

interface DashboardNavProps {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

export const DashboardNav = ({ tabs, selected, onSelect }: DashboardNavProps) => {
  return (
    <nav className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={selected === tab ? styles.tabActive : styles.tab}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};
