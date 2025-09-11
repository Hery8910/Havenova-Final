import React from 'react';
interface I18nContextType {
    language: string;
    setLanguage: (lang: string) => void;
    texts: Record<string, any>;
}
export declare function I18nProvider({ children, initialLanguage, initialTexts, }: {
    children: React.ReactNode;
    initialLanguage: string;
    initialTexts: Record<string, any>;
}): import("react/jsx-runtime").JSX.Element;
export declare function useI18n(): I18nContextType;
export {};
//# sourceMappingURL=I18nContext.d.ts.map