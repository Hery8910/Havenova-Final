import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/blog/BlogTableSkeleton.tsx
import styles from './BlogTableSkeleton.module.css';
export default function BlogTableSkeleton() {
    return (_jsx("ul", { className: styles.tableList, children: _jsxs("li", { className: styles.headerRow, children: [_jsx("span", { children: "Name" }), _jsx("span", { children: "Created at" }), _jsx("span", { children: "Comments" }), _jsx("span", { children: "Status" }), _jsx("span", {})] }) }));
}
