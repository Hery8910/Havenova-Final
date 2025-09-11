export type ServiceStatus = 'submitted' | 'accepted' | 'in progress' | 'completed' | 'cancelled';
export type ServiceType = 'house-service' | 'kitchen-cleaning' | 'kitchen-assembly' | 'house-cleaning' | 'furniture-assembly' | 'window-cleaning';
export type ServiceIcon = {
    src: string;
    alt: string;
};
export interface BaseServiceDetails {
    title: string;
    icon: ServiceIcon;
    notes?: string;
}
export interface ServiceRequest {
    id: string;
    userId: string;
    createdAt: string;
    serviceAddress: string;
    preferredDate: string;
    preferredTime: string;
    status: ServiceStatus;
    totalPrice: number;
    totalEstimatedDuration: number;
    services: ServiceRequestItem[];
}
export interface FurnitureAssemblyRequest {
    id: string;
    serviceType: 'furniture-assembly';
    price: number;
    estimatedDuration: number;
    icon: ServiceIcon;
    details: BaseServiceDetails & {
        type: string;
        location: string;
        quantity: number;
        position: string;
        width?: string;
        height?: string;
        depth?: string;
        doors?: number;
        drawers?: number;
        notes?: string;
    };
}
export interface KitchenAssemblyRequest {
    serviceType: 'kitchen-assembly';
    price: number;
    estimatedDuration: number;
    details: BaseServiceDetails & {
        length: number;
        lowerCabinets: number;
        upperCabinets: number;
        layout: string;
        appliances: string[];
        island?: string;
        islandCabinet?: number;
        islandLength?: string;
        islandWidth?: string;
        disassemblyNeed?: string;
        provider?: string;
    };
}
export interface KitchenCleaningRequest {
    serviceType: 'kitchen-cleaning';
    price: number;
    estimatedDuration: number;
    details: BaseServiceDetails & {
        appliances: string[];
        size: number;
    };
}
export interface HouseCleaningRequest {
    serviceType: 'house-cleaning';
    price: number;
    estimatedDuration: number;
    details: BaseServiceDetails & {
        surface: number;
        livingRoom: number;
        bedRooms: number;
        badRooms: number;
        balcon?: number;
        kitchen: string;
        stairs?: string;
    };
}
export interface WindowCleaningRequest {
    serviceType: 'window-cleaning';
    price: number;
    estimatedDuration: number;
    details: BaseServiceDetails & {
        windows: number;
        doors: number;
        access: string;
    };
}
export interface HouseServiceRequest {
    serviceType: 'house-service';
    price: number;
    estimatedDuration: number;
    details: BaseServiceDetails & {
        label: string;
        category: string;
        quantity: number;
        area: string;
        length: string;
        rooms: number;
        ceiling: string;
        floorType: string;
        removeOld?: string;
    };
}
export type ServiceRequestItem = FurnitureAssemblyRequest | KitchenAssemblyRequest | KitchenCleaningRequest | HouseCleaningRequest | WindowCleaningRequest | HouseServiceRequest;
//# sourceMappingURL=services.d.ts.map