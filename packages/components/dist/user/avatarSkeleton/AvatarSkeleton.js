import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './AvatarSkeleton.module.css';
const AvatarSkeleton = () => (_jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.button, "aria-label": "Avatar loading", children: [_jsx("span", { style: {
                    display: 'inline-block',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #888 40%, #ddd 60%)',
                    animation: 'pulse 1.5s infinite',
                } }), _jsx("span", { style: {
                    width: 80,
                    height: 18,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #aaa 40%, #eee 60%)',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                } }), _jsx("style", { children: `
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 0.45; }
          100% { opacity: 0.8; }
        }
      ` })] }) }));
export default AvatarSkeleton;
