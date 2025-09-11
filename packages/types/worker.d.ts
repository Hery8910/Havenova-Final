export type EmploymentType = 'EMPLOYEE' | 'CONTRACTOR';
export type PayType = 'HOURLY' | 'SALARIED';
export type Currency = 'EUR';
export interface CreateWorkerPayload {
    name: string;
    email: string;
    phone?: string;
    profileImage: string;
    password?: string;
    roles?: string[];
    language: string;
    clientId: string;
    employment?: {
        type: EmploymentType;
        startDate: string;
        endDate?: string | undefined;
    };
    pay?: {
        type: 'HOURLY';
        currency: Currency;
        hourlyRate: number;
    } | {
        type: 'SALARIED';
        currency: Currency;
        monthlySalary: number;
    };
}
//# sourceMappingURL=worker.d.ts.map