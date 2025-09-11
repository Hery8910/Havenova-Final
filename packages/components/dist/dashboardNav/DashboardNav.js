import { jsx as _jsx } from "react/jsx-runtime";
import styles from './DashboardNav.module.css';
export const DashboardNav = ({ tabs, selected, onSelect }) => {
    return (_jsx("nav", { className: styles.tabBar, children: tabs.map((tab) => (_jsx("button", { className: selected === tab ? styles.tabActive : styles.tab, onClick: () => onSelect(tab), children: tab }, tab))) }));
};
