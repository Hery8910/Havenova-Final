'use client';
import React from 'react';
import { FurnitureAssemblyDetails, ServiceIcon, ServiceRequestItem } from '../../../types/services';
import FurnitureAssemblyRequestView from '../furnitureAssembly/FurnitureAssemblyRequestView/FurnitureAssemblyRequestView';
// import WindowCleaningRequest from '../windowsCleaning/windowsCleaningRequest/WindowCleaningRequest';
// import HouseCleaningRequest from '../houseCleaning/houseCleaningRequest/HouseCleaningRequest';
// import KitchenAssemblyRequest from '../kitchenAssembly/kitchenAssemblyRequest/KitchenAssemblyRequest';
// import HouseServiceRequest from '../houseService/houseServiceRequest/HouseServiceRequest';
// import KitchenCleaningRequest from '../kitchenCleaning/kitchenCleaningRequest/KitchenCleaningRequest';
interface Props {
  type: ServiceRequestItem['serviceType'];
  requests: ServiceRequestItem[];
  onRemove: (id: string) => void;
}

const ServiceRenderer = ({ type, requests, onRemove }: Props) => {
  switch (type) {
    // case 'kitchen-cleaning': {
    //   const filtered = requests.filter(
    //     (
    //       req
    //     ): req is {
    //       id: string;
    //       serviceType: 'kitchen-cleaning';
    //       price: number;
    //       estimatedDuration: number;
    //       details: any;
    //     } => req.serviceType === 'kitchen-cleaning'
    //   );
    //   return <KitchenCleaningRequest requests={filtered} onClick={onRemove}/>;
    // }
    // case 'house-service': {
    //   const filtered = requests.filter(
    //     (
    //       req
    //     ): req is {
    //       id: string;
    //       serviceType: 'house-service';
    //       price: number;
    //       estimatedDuration: number;
    //       details: any;
    //     } => req.serviceType === 'house-service'
    //   );
    //   return <HouseServiceRequest requests={filtered} onClick={onRemove}/>;
    // }
    // case 'kitchen-assembly': {
    //   const filtered = requests.filter(
    //     (
    //       req
    //     ): req is {
    //       id: string;
    //       serviceType: 'kitchen-assembly';
    //       price: number;
    //       estimatedDuration: number;
    //       details: any;
    //     } => req.serviceType === 'kitchen-assembly'
    //   );
    //   return <KitchenAssemblyRequest requests={filtered} onClick={onRemove}/>;
    // }
    case 'furniture-assembly': {
      const filtered = requests.filter(
        (
          req
        ): req is {
          id: string;
          serviceType: 'furniture-assembly';
          price: number;
          estimatedDuration: number;
          icon: ServiceIcon;
          details: FurnitureAssemblyDetails;
        } => req.serviceType === 'furniture-assembly'
      );
      return <FurnitureAssemblyRequestView requests={filtered} onClick={onRemove} />;
    }
    // case 'window-cleaning': {
    //   const filtered = requests.filter(
    //     (
    //       req
    //     ): req is {
    //       id: string;
    //       serviceType: 'window-cleaning';
    //       price: number;
    //       estimatedDuration: number;
    //       details: any;
    //     } => req.serviceType === 'window-cleaning'
    //   );
    //   return <WindowCleaningRequest requests={filtered} onClick={onRemove}/>;
    // }
    // case 'house-cleaning': {
    //   const filtered = requests.filter(
    //     (
    //       req
    //     ): req is {
    //       id: string;
    //       serviceType: 'house-cleaning';
    //       price: number;
    //       estimatedDuration: number;
    //       details: any;
    //     } => req.serviceType === 'house-cleaning'
    //   );
    //   return <HouseCleaningRequest requests={filtered} onClick={onRemove}/>;
    // }
    default:
      return null;
  }
};
export default ServiceRenderer;
