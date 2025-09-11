import React from 'react';
interface AlertPopupProps {
    type: 'success' | 'error';
    title: string;
    description: string;
    onClose?: () => void;
}
declare const AlertPopup: React.FC<AlertPopupProps>;
export default AlertPopup;
//# sourceMappingURL=AlertPopup.d.ts.map