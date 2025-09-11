import React from 'react';
import styles from './DashboardNav.module.css';
export const DashboardNav = ({ tabs, selected, onSelect }) => {
    return (<nav className={styles.tabBar}>
      {tabs.map((tab) => (<button key={tab} className={selected === tab ? styles.tabActive : styles.tab} onClick={() => onSelect(tab)}>
          {tab}
        </button>))}
    </nav>);
};
