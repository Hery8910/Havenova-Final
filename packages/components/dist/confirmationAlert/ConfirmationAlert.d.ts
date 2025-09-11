import React from 'react';
interface ConfirmationAlertProps {
    title: string;
    message: string;
    animationData?: object;
    confirmLabel?: string;
    cancelLabel?: string;
    extraClass?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
declare const ConfirmationAlert: React.FC<ConfirmationAlertProps>;
export default ConfirmationAlert;
//# sourceMappingURL=ConfirmationAlert.d.ts.map