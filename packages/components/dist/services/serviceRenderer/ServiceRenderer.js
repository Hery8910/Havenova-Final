"use strict";
// 'use client';
// import React from 'react';
// import { ServiceRequestItem } from '../../../types/services';
// import FurnitureAssemblyRequest from '../furnitureAssembly/furnitureAssemblyRequest/FurnitureAssemblyRequest';
// import WindowCleaningRequest from '../windowsCleaning/windowsCleaningRequest/WindowCleaningRequest';
// import HouseCleaningRequest from '../houseCleaning/houseCleaningRequest/HouseCleaningRequest';
// import KitchenAssemblyRequest from '../kitchenAssembly/kitchenAssemblyRequest/KitchenAssemblyRequest';
// import HouseServiceRequest from '../houseService/houseServiceRequest/HouseServiceRequest';
// import KitchenCleaningRequest from '../kitchenCleaning/kitchenCleaningRequest/KitchenCleaningRequest';
// interface Props {
//   type: ServiceRequestItem['serviceType'];
//   requests: ServiceRequestItem[];
// }
// const ServiceRenderer = ({ type, requests }: Props) => {
//   switch (type) {
//     case 'kitchen-cleaning': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'kitchen-cleaning';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'kitchen-cleaning'
//       );
//       return <KitchenCleaningRequest requests={filtered} />;
//     }
//     case 'house-service': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'house-service';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'house-service'
//       );
//       return <HouseServiceRequest requests={filtered} />;
//     }
//     case 'kitchen-assembly': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'kitchen-assembly';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'kitchen-assembly'
//       );
//       return <KitchenAssemblyRequest requests={filtered} />;
//     }
//     case 'furniture-assembly': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'furniture-assembly';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'furniture-assembly'
//       );
//       return <FurnitureAssemblyRequest requests={filtered} />;
//     }
//     case 'window-cleaning': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'window-cleaning';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'window-cleaning'
//       );
//       return <WindowCleaningRequest requests={filtered} />;
//     }
//     case 'house-cleaning': {
//       const filtered = requests.filter(
//         (
//           req
//         ): req is {
//           id: string;
//           serviceType: 'house-cleaning';
//           price: number;
//           estimatedDuration: number;
//           details: any;
//         } => req.serviceType === 'house-cleaning'
//       );
//       return <HouseCleaningRequest requests={filtered} />;
//     }
//     default:
//       return null;
//   }
// };
// export default ServiceRenderer;
