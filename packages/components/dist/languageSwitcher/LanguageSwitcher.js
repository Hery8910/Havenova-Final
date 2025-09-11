import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUser } from '../../contexts/UserContext';
import { useI18n } from '../../contexts/I18nContext';
import styles from './LanguageSwitcher.module.css';
import { IoLanguage } from 'react-icons/io5';
export default function LanguageSwitcher() {
    const { setLanguage, language } = useI18n();
    const { updateUserLanguage, user } = useUser();
    const handleChange = async (lang) => {
        setLanguage(lang);
        await updateUserLanguage(lang);
    };
    return (_jsx("nav", { children: language === 'en' ? (_jsxs("button", { className: styles.button, onClick: () => handleChange('de'), children: [_jsx(IoLanguage, {}), " ", _jsx("p", { children: "De" })] })) : (_jsxs("button", { className: styles.button, onClick: () => handleChange('en'), children: [_jsx(IoLanguage, {}), " ", _jsx("p", { children: "En" })] })) }));
}
