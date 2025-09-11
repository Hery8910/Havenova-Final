"use strict";
// 'use client';
// import { useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import styles from './HouseServiceForm.module.css';
// import Image from 'next/image';
// import {
//   HouseServiceData,
//   serviceIcon,
//   houseServiceInput,
//   ServiceRequestItem,
// } from '../../../../types/services';
// import { useUser } from '../../../../contexts/UserContext';
// import { handleServiceRequest } from '../../../../services/serviceRequestHandler';
// import { IoClose } from 'react-icons/io5';
// import Select from '../../../select/Select';
// import ConfirmationAlert from '../../../confirmationAlert/ConfirmationAlert';
// import { useRouter } from 'next/navigation';
// const HouseServiceForm = () => {
//   const houseServiceCategory = [
//     {
//       category: 'Painting',
//       services: [
//         {
//           id: 'wall_painting',
//           label: 'Wall Painting',
//           icon: {
//             src: '/svg/houseService/wall_painting.svg',
//             alt: 'Wall Painting icon',
//           },
//           input: {
//             quantity: false,
//             area: true,
//             rooms: true,
//             ceiling: true,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'door_painting',
//           label: 'Door Painting',
//           icon: {
//             src: '/svg/houseService/door_painting.svg',
//             alt: 'Door Painting icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'window_painting',
//           label: 'Window Painting',
//           icon: {
//             src: '/svg/houseService/window_painting.svg',
//             alt: 'Window Painting icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'house_facade_painting',
//           label: 'House Facade Painting',
//           icon: {
//             src: '/svg/houseService/house_facade_painting.svg',
//             alt: 'House Facade Painting icon',
//           },
//           input: {
//             quantity: false,
//             area: true,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//       ],
//     },
//     {
//       category: 'Renovation',
//       services: [
//         {
//           id: 'TV_hanging',
//           label: 'TV Hanging',
//           icon: {
//             src: '/svg/houseService/tv_hanging.svg',
//             alt: 'TV Hanging icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'drywall_installation',
//           label: 'Drywall Installation',
//           icon: {
//             src: '/svg/houseService/drywall.svg',
//             alt: 'Drywall Installation icon',
//           },
//           input: {
//             quantity: false,
//             area: true,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'flooring',
//           label: 'Flooring Installation',
//           icon: { src: '/svg/houseService/flooring.svg', alt: 'Flooring icon' },
//           input: {
//             quantity: false,
//             area: true,
//             rooms: false,
//             ceiling: false,
//             floorType: true,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'wallpapering',
//           label: 'Wallpapering',
//           icon: {
//             src: '/svg/houseService/wallpapering.svg',
//             alt: 'Wallpapering icon',
//           },
//           input: {
//             quantity: false,
//             area: true,
//             rooms: true,
//             ceiling: true,
//             floorType: false,
//             floor_type: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'picture_hanging',
//           label: 'Hanging Picture/Mirror',
//           icon: {
//             src: '/svg/houseService/picture_hanging.svg',
//             alt: 'Picture Hanging icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'shower_cabin_instalation',
//           label: 'Shower Cabin Instalation',
//           icon: {
//             src: '/svg/houseService/shower_cabin.svg',
//             alt: 'Shower Cabin icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'bathtub_instalation',
//           label: 'Bathtub Instalation',
//           icon: {
//             src: '/svg/houseService/bathtub.svg',
//             alt: 'B   athtub icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'demolition',
//           label: 'Demolition',
//           icon: {
//             src: '/svg/houseService/demolition.svg',
//             alt: 'Demolition icon',
//           },
//           input: {
//             quantity: false,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'curtain_installation',
//           label: 'Curtain/Blind Installation',
//           icon: {
//             src: '/svg/houseService/curtains.svg',
//             alt: 'Curtain Installation icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: true,
//           },
//         },
//         {
//           id: 'baseboard_installation',
//           label: 'Baseboard Installation',
//           icon: {
//             src: '/svg/houseService/baseboard.svg',
//             alt: 'Baseboard Installation icon',
//           },
//           input: {
//             quantity: false,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: true,
//           },
//         },
//         {
//           id: 'door_adjustment',
//           label: 'Repair Door/Windows',
//           icon: {
//             src: '/svg/houseService/door_adjustment.svg',
//             alt: 'Door Adjustment icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'door_instalation',
//           label: 'Instalation Door/Windows',
//           icon: {
//             src: '/svg/houseService/window_instalation.svg',
//             alt: 'Door instalation icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//       ],
//     },
//     {
//       category: 'Plumbing',
//       services: [
//         {
//           id: 'faucet_replacement',
//           label: 'Faucet Replacement',
//           icon: {
//             src: '/svg/houseService/faucet_replacement.svg',
//             alt: 'Faucet icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'shower_instalation',
//           label: 'Shower Instalation',
//           icon: {
//             src: '/svg/houseService/shower_instalation.svg',
//             alt: 'Shower Instalation',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'water_meter_instalation',
//           label: 'Water Meter Instalation',
//           icon: {
//             src: '/svg/houseService/water_meter_instalation.svg',
//             alt: 'Water Meter Instalation',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'siphon_installation',
//           label: 'Siphon Trap Installation',
//           icon: { src: '/svg/houseService/siphon.svg', alt: 'Siphon icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'washing_machine_connection',
//           label: 'Washing Machine Connection',
//           icon: {
//             src: '/svg/houseService/washing_machine.svg',
//             alt: 'Washing Machine icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: true,
//             length: false,
//           },
//         },
//         {
//           id: 'dishwasher_connection',
//           label: 'Dishwasher Connection',
//           icon: {
//             src: '/svg/houseService/dishwasher.svg',
//             alt: 'Dishwasher icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'bidet_installation',
//           label: 'Bidet Installation',
//           icon: { src: '/svg/houseService/bidet.svg', alt: 'Bidet icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'washbasin_installation',
//           label: 'Wash Basin Installation',
//           icon: {
//             src: '/svg/houseService/washbasin.svg',
//             alt: 'Wash Basin icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'toilet_installation',
//           label: 'Toilet Installation',
//           icon: { src: '/svg/houseService/toilet.svg', alt: 'Toilet icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'hose_replacement',
//           label: 'Hose Replacement',
//           icon: { src: '/svg/houseService/hose.svg', alt: 'Hose icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'dismantling_sanitary',
//           label: 'Dismantling Basin/WC Seat',
//           icon: {
//             src: '/svg/houseService/dismantling.svg',
//             alt: 'Dismantling icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'drain_cleaning',
//           label: 'Drain Cleaning',
//           icon: {
//             src: '/svg/houseService/drain_cleaning.svg',
//             alt: 'Drain Cleaning icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//       ],
//     },
//     {
//       category: 'Electricity',
//       services: [
//         {
//           id: 'electrical_point_implementation',
//           label: 'Implementation of Electrical Point',
//           icon: {
//             src: '/svg/houseService/electrical_point.svg',
//             alt: 'Electrical Point icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'distributor_replacement',
//           label: 'Distributor Replacement',
//           icon: {
//             src: '/svg/houseService/distributor_replacement.svg',
//             alt: 'Distributor Replacement icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'bulb_replacement',
//           label: 'Bulb Replacement',
//           icon: {
//             src: '/svg/houseService/bulb_replacement.svg',
//             alt: 'Bulb Replacement icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'socket_installation',
//           label: 'Socket Installation/Replacement',
//           icon: { src: '/svg/houseService/socket.svg', alt: 'Socket icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'lamp_chandelier_installation',
//           label: 'Chandelier Installation/Replacement',
//           icon: {
//             src: '/svg/houseService/chandelier.svg',
//             alt: 'Chandelier icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'electricity_meter_installation',
//           label: 'Electricity Meter Installation',
//           icon: {
//             src: '/svg/houseService/electricity_meter.svg',
//             alt: 'Electricity Meter icon',
//           },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'electrical_repair',
//           label: 'Repair of Electrical Connections',
//           icon: { src: '/svg/houseService/repair.svg', alt: 'Repair icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'hob_connection',
//           label: 'Electric Hob Connection',
//           icon: { src: '/svg/houseService/hob.svg', alt: 'Electric Hob icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//         {
//           id: 'switch_installation',
//           label: 'Switch Installation/Replacement',
//           icon: { src: '/svg/houseService/switch.svg', alt: 'Switch icon' },
//           input: {
//             quantity: true,
//             area: false,
//             rooms: false,
//             ceiling: false,
//             floorType: false,
//             remove_old: false,
//             length: false,
//           },
//         },
//       ],
//     },
//   ];
//   const floorOptions = [
//     {
//       name: 'Laminate',
//       icon: { src: '/svg/floorTypes/laminate.svg', alt: 'Laminate Flooring' },
//     },
//     {
//       name: 'Hardwood',
//       icon: { src: '/svg/floorTypes/hardwood.svg', alt: 'Hardwood Flooring' },
//     },
//     {
//       name: 'Vinyl',
//       icon: { src: '/svg/floorTypes/vinyl.svg', alt: 'Vinyl Flooring' },
//     },
//     {
//       name: 'Ceramic Tiles',
//       icon: {
//         src: '/svg/floorTypes/ceramic_tiles.svg',
//         alt: 'Ceramic Tile Flooring',
//       },
//     },
//     {
//       name: 'Carpet',
//       icon: { src: '/svg/floorTypes/carpet.svg', alt: 'Carpet Flooring' },
//     },
//     {
//       name: 'Parquet',
//       icon: { src: '/svg/floorTypes/parquet.svg', alt: 'Parquet Flooring' },
//     },
//   ];
//   const router = useRouter();
//   const { user, refreshUser, addRequestToUser } = useUser();
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [selectedItem, setSelectedItem] = useState<string>('');
//   const [icon, setIcon] = useState<serviceIcon>({ src: '', alt: '' });
//   const [alertOpen, setAlertOpen] = useState<boolean>(false);
//   const [input, setInput] = useState<houseServiceInput>({
//     quantity: true,
//     area: true,
//     rooms: true,
//     ceiling: true,
//     floorType: true,
//     remove_old: true,
//     length: true,
//   });
//   const [open, setOpen] = useState<boolean>(false);
//   const [formData, setFormData] = useState<HouseServiceData>({
//     title: 'House Service',
//     icon: {
//       src: icon.src,
//       alt: icon.alt,
//     },
//     label: '',
//     category: selectedCategory,
//     area: '',
//     length: '0',
//     rooms: 0,
//     ceiling: 'no',
//     floorType: '',
//     removeOld: 'no',
//     quantity: 1,
//     notes: '',
//   });
//   useEffect(() => {
//     if (houseServiceCategory.length > 0) {
//       setSelectedCategory(houseServiceCategory[0].category);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const handleSelect = (category: string) => {
//     setSelectedCategory(category);
//   };
//   const activeGroup = houseServiceCategory.find((group) => group.category === selectedCategory);
//   const handleClick = (label: string, icon: serviceIcon, input: houseServiceInput) => {
//     setSelectedItem(label);
//     setInput(input);
//     setIcon(icon);
//     setOpen(true);
//     setFormData((prev) => ({
//       ...prev,
//       title: 'House Service',
//       icon,
//       label: label,
//       category: selectedCategory,
//       quantity: 1,
//     }));
//   };
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     const typedValue = type === 'number' ? parseFloat(value) || '' : value;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: typedValue,
//       title: 'House Service',
//       icon: {
//         src: icon.src,
//         alt: icon.alt,
//       },
//       type: selectedItem,
//       category: selectedCategory,
//     }));
//   };
//   const handleAdjust = (field: 'rooms' | 'quantity', action: 'add' | 'subtract') => {
//     setFormData((prev) => {
//       const current = field === 'quantity' ? Number(prev.quantity) : prev[field];
//       const updated = action === 'add' ? current + 1 : Math.max(1, current - 1);
//       return {
//         ...prev,
//         [field]: field === 'quantity' ? String(updated) : updated,
//       };
//     });
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newRequest: ServiceRequestItem = {
//       id: uuidv4(),
//       serviceType: 'house-service',
//       price: 0,
//       estimatedDuration: 0,
//       details: formData,
//     };
//     try {
//       await handleServiceRequest({
//         user,
//         newRequest,
//         addRequestToUser,
//       });
//       setFormData({
//         title: 'House Service',
//         icon: {
//           src: icon.src,
//           alt: icon.alt,
//         },
//         label: '',
//         category: selectedCategory,
//         area: '',
//         length: '0',
//         rooms: 0,
//         ceiling: 'no',
//         floorType: '',
//         removeOld: 'no',
//         quantity: 1,
//         notes: '',
//       });
//       setAlertOpen(true);
//       setOpen(false);
//       refreshUser();
//     } catch (err) {
//       console.error('❌ Error saving to cart:', err);
//     }
//   };
//   return (
//     <main className={styles.main}>
//       <header className={styles.header} style={open ? { opacity: '0.2' } : { opacity: '1' }}>
//         {houseServiceCategory.map((group) => (
//           <button
//             key={group.category}
//             onClick={() => handleSelect(group.category)}
//             className={` button ${selectedCategory === group.category ? `${styles.active}` : ''}`}
//           >
//             {group.category}
//           </button>
//         ))}
//       </header>
//       {activeGroup && (
//         <ul className={styles.ul} style={open ? { opacity: '0.2' } : { opacity: '1' }}>
//           {activeGroup.services.map((item) => (
//             <li
//               key={item.id}
//               className={styles.li}
//               onClick={() => handleClick(item.label, item.icon, item.input)}
//             >
//               <Image
//                 className={styles.li_image}
//                 src={item.icon.src}
//                 priority={true}
//                 alt={item.icon.alt}
//                 width={50}
//                 height={50}
//               />
//               <p className={styles.li_p}>{item.label}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//       {open && (
//         <aside className={styles.aside}>
//           <header className={styles.aside_header}>
//             <Image
//               className={styles.aside_image}
//               src={icon.src}
//               priority={true}
//               alt={icon.alt}
//               width={75}
//               height={75}
//             />
//             <div>
//               <h4>{formData.title}</h4>
//               <p>{selectedItem}</p>
//             </div>
//             <button className={styles.aside_button} onClick={() => setOpen(false)}>
//               <IoClose />
//             </button>
//           </header>
//           <form className={styles.form} onSubmit={handleSubmit}>
//             {input.quantity && (
//               <div className={styles.form_div}>
//                 <p>Quantity</p>
//                 <div className={styles.counter}>
//                   <button
//                     className={styles.rest_button}
//                     type="button"
//                     onClick={() => handleAdjust('quantity', 'subtract')}
//                   >
//                     -
//                   </button>
//                   <p className={styles.counter_p}>{formData.quantity}</p>
//                   <button
//                     className={styles.add_button}
//                     type="button"
//                     onClick={() => handleAdjust('quantity', 'add')}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             )}
//             {input.area && (
//               <div className={styles.form_div}>
//                 <label className={styles.label}>Area</label>
//                 <div className={styles.div}>
//                   <input
//                     className={styles.input}
//                     type="number"
//                     name="area"
//                     value={formData.area || ''}
//                     onChange={handleChange}
//                     placeholder="0"
//                   />
//                   <label className={styles.label}>m²</label>
//                 </div>
//               </div>
//             )}
//             {input.length && (
//               <div className={styles.form_div}>
//                 <label className={styles.label}>Length</label>
//                 <div className={styles.div}>
//                   <input
//                     className={styles.input}
//                     type="number"
//                     name="length"
//                     value={formData.length || ''}
//                     onChange={handleChange}
//                     placeholder="0"
//                   />
//                   <label className={styles.label}>m</label>
//                 </div>
//               </div>
//             )}
//             {input.rooms && (
//               <div className={styles.form_div}>
//                 <p>Rooms</p>
//                 <div className={styles.counter}>
//                   <button
//                     className={styles.rest_button}
//                     type="button"
//                     onClick={() => handleAdjust('rooms', 'subtract')}
//                   >
//                     -
//                   </button>
//                   <p className={styles.counter_p}>{formData.rooms}</p>
//                   <button
//                     className={styles.add_button}
//                     type="button"
//                     onClick={() => handleAdjust('rooms', 'add')}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             )}
//             {input.ceiling && (
//               <div className={styles.form_div}>
//                 <label className={styles.label}>Ceiling included?</label>
//                 <label className={styles.switch}>
//                   <input
//                     type="checkbox"
//                     checked={formData.ceiling === 'yes'}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         ceiling: e.target.checked ? 'yes' : 'no',
//                       }))
//                     }
//                   />
//                   <span className={styles.slider}></span>
//                 </label>
//               </div>
//             )}
//             {input.floorType && (
//               <Select
//                 label="Select Floor Type"
//                 options={floorOptions}
//                 onChange={(selected) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     floorType: selected[0] || '',
//                   }))
//                 }
//                 multiple={false}
//               />
//             )}
//             {input.remove_old && (
//               <div className={styles.form_div}>
//                 <label className={styles.label}>Old should be removed?</label>
//                 <label className={styles.switch}>
//                   <input
//                     type="checkbox"
//                     checked={formData.removeOld === 'yes'}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         removeOld: e.target.checked ? 'yes' : 'no',
//                       }))
//                     }
//                   />
//                   <span className={styles.slider}></span>
//                 </label>
//               </div>
//             )}
//             <textarea
//               className={styles.textarea}
//               name="notes"
//               value={formData.notes || ''}
//               onChange={handleChange}
//               placeholder="Leave us a comment"
//             />
//             <button className={styles.submit} type="submit">
//               Submit
//             </button>
//           </form>
//         </aside>
//       )}
//       {alertOpen && (
//         <ConfirmationAlert
//           title="Your request has been submitted!"
//           message="Do you want to continue to checkout or keep browsing for more services?"
//           animationData={successAnimation}
//           confirmLabel="Go to Checkout"
//           cancelLabel="Keep Browsing"
//           extraClass="success"
//           onCancel={() => setAlertOpen(false)}
//           onConfirm={() => {
//             router.push('/checkout');
//           }}
//         />
//       )}
//     </main>
//   );
// };
// export default HouseServiceForm;
