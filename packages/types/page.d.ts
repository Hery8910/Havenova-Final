export type PageProps<T extends Record<string, any> = {}> = {
    params: T;
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
};
//# sourceMappingURL=page.d.ts.map