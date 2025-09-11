"use strict";
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { createOffer, updateOffer } from '../../services/offers';
// import styles from './OfferForm.module.css';
// import { CTAAction, Offer, OfferDB, OfferType } from '../../types/offers';
// import ImageUpload from '../imageUpload/ImageUpload';
// import { useUser } from '../../contexts/UserContext';
// import Input from '../blog/input/Input';
// import Info from '../info/Info';
// import { validateTitle } from '../../utils/validators';
// import Select from '../select/Select';
// import SelectDashboard from '../selectDashboard/SelectDashboard';
// import OfferCard from '../offerCard/OfferCard';
// const initialOffer: Offer = {
//   clientId: '', // valor temporal
//   title: '',
//   description: '',
//   type: 'MEMBERSHIP_DISCOUNT',
//   percentage: 10,
//   serviceTypes: [],
//   startDate: '',
//   endDate: '',
//   featuredImage: '',
//   ctaAction: '/user/register',
//   ctaText: 'Create Your Profile',
//   details: '',
//   active: false,
// };
// interface OfferFormProps {
//   onSuccess: () => void;
//   editOffer?: OfferDB | null;
// }
// interface SelectOption {
//   name: string;
//   value: OfferType;
// }
// const offerOptions: SelectOption[] = [
//   {
//     name: 'Service Discount',
//     value: 'SERVICE_DISCOUNT',
//   },
//   {
//     name: 'Menbership Discount',
//     value: 'MEMBERSHIP_DISCOUNT',
//   },
//   {
//     name: 'Referral Reward',
//     value: 'REFERRAL_REWARD',
//   },
//   {
//     name: 'New Client Discount',
//     value: 'NEW_CLIENT_DISCOUNT',
//   },
// ];
// const ctaOptions = [
//   {
//     name: 'Register Page',
//     path: '/user/register',
//   },
//   // {
//   //   name: "Membership Page",
//   //   path: "/user/membership",
//   // },
//   // {
//   //   name: "Furniture Assembly",
//   //   path: "/services/furniture-assembly",
//   // },
//   // {
//   //   name: "Kitchen Assembly",
//   //   path: "/services/kitchen-assembly",
//   // },
//   //  {
//   //   name: "Home Service",
//   //   path: "/services/home-service",
//   // },
//   //  {
//   //   name: "House Cleaning",
//   //   path: "/services/house-cleaning",
//   // },
//   //  {
//   //   name: "Kitchen Cleaning",
//   //   path: "/services/kitchen-cleaning",
//   // },
//   //  {
//   //   name: "Windows Cleaning",
//   //   path: "/services/windows-cleaning",
//   // },
//   //  {
//   //   name: "Referral Program",
//   //   valupathe: "/referral",
//   // },
// ];
// const OfferForm: React.FC<OfferFormProps> = ({ onSuccess, editOffer = null }) => {
//   const { user } = useUser();
//   const [formData, setFormData] = useState<Offer>(initialOffer);
//   const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
//   const [loading, setLoading] = useState(false);
//   const [serviceInput, setServiceInput] = useState('');
//   if (!user) return;
//   useEffect(() => {
//     if (editOffer) {
//       const formatDate = (dateStr: string) => new Date(dateStr).toISOString().split('T')[0];
//       setFormData({
//         ...editOffer,
//         startDate: formatDate(editOffer.startDate),
//         endDate: formatDate(editOffer.endDate),
//       });
//     } else if (user?._id) {
//       setFormData(() => ({
//         ...initialOffer,
//         clientId: user._id,
//         type: 'MEMBERSHIP_DISCOUNT',
//         percentage: 10,
//         ctaAction: '/user/register',
//         ctaText: 'Create Your Profile',
//       }));
//     }
//   }, [editOffer, user]);
//   console.log(formData);
//   if (!formData) return <p>Loading...</p>;
//   function validateOffer(offer: Offer): { [key: string]: string | null } {
//     return {
//       title: offer.title.trim() ? null : 'Title is required.',
//       description: offer.description.trim() ? null : 'Description is required.',
//       details: offer.details.trim() ? null : 'Details are required.',
//       featuredImage: offer.featuredImage.trim() ? null : 'Image is required.',
//       startDate: offer.startDate ? null : 'Start date is required.',
//       endDate: offer.endDate ? null : 'End date is required.',
//       ctaText: offer.ctaText.trim() ? null : 'CTA text is required.',
//       ctaAction: offer.ctaAction.trim() ? null : 'CTA link is required.',
//     };
//   }
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     console.log(formData);
//     // console.log(formData);
//   };
//   const addServiceType = () => {
//     if (serviceInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         serviceTypes: [...(prev.serviceTypes || []), serviceInput.trim()],
//       }));
//       setServiceInput('');
//     }
//   };
//   const removeServiceType = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       serviceTypes: (prev.serviceTypes || []).filter((_, i) => i !== index),
//     }));
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const fieldErrors = validateOffer(formData);
//     setErrors(fieldErrors);
//     const hasErrors = Object.values(fieldErrors).some((err) => err !== null);
//     if (hasErrors) {
//       setLoading(false);
//       return;
//     }
//     try {
//       if (editOffer && editOffer._id) {
//         // ✅ Editar oferta existente
//         await updateOffer(editOffer._id, formData as OfferDB);
//       } else {
//         // ✅ Crear nueva oferta
//         await createOffer(formData as Offer);
//       }
//       onSuccess();
//       // Restablecer solo si es nueva oferta
//       if (!editOffer) {
//         setFormData({
//           clientId: user._id,
//           title: '',
//           description: '',
//           type: 'SERVICE_DISCOUNT',
//           percentage: 10,
//           serviceTypes: [],
//           startDate: '',
//           endDate: '',
//           featuredImage: '',
//           ctaAction: '/user/register',
//           ctaText: 'Create Your Profile',
//           details: '',
//           active: false,
//         });
//       }
//     } catch (err) {
//       console.error('Failed to submit offer:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <section className={styles.section}>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <h2>Create a New Offer</h2>
//         <header className={styles.header}>
//           <article className={styles.header_article}>
//             <div className={styles.header_div}>
//               <h4>Offer Title</h4>
//               <Info
//                 direction="left"
//                 info={{
//                   question: 'What is the offer title?',
//                   answer: 'It will be shown as the main headline for your offer.',
//                 }}
//               />
//             </div>
//             <Input
//               heading="subheading"
//               value={formData.title}
//               onChange={(value) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   title: value,
//                 }))
//               }
//               onBlur={(value) =>
//                 setErrors((errs) => ({
//                   ...errs,
//                   title: validateTitle(value),
//                 }))
//               }
//               placeholder="Enter your offer title"
//             />
//           </article>
//           <article className={styles.header_article}>
//             <div className={styles.header_div}>
//               <h4>Short Description</h4>
//               <Info
//                 direction="left"
//                 info={{
//                   question: 'What is the description?',
//                   answer: 'A short summary shown below the title.',
//                 }}
//               />
//             </div>
//             <Input
//               heading="paragraph"
//               value={formData.description}
//               onChange={(value) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   description: value,
//                 }))
//               }
//               onBlur={() =>
//                 setErrors((errs) => ({
//                   ...errs,
//                   description: 'The description is required.',
//                 }))
//               }
//               placeholder="Description"
//               height="120px"
//             />
//           </article>
//           <article className={styles.header_article}>
//             <div className={styles.header_div}>
//               <h4>Offer Details</h4>
//               <Info
//                 direction="left"
//                 info={{
//                   question: 'What are the details?',
//                   answer: 'Detailed information displayed when users click to read more.',
//                 }}
//               />
//             </div>
//             <Input
//               heading="paragraph"
//               value={formData.details}
//               onChange={(value) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   details: value,
//                 }))
//               }
//               onBlur={() =>
//                 setErrors((errs) => ({
//                   ...errs,
//                   details: 'Offer Details are required.',
//                 }))
//               }
//               maxLength={500}
//               placeholder="Offer Details"
//               height="150px"
//             />
//           </article>
//           <article className={styles.article}>
//             <div className={styles.div_small}>
//               <label className={styles.label}>Call-to-Action Text</label>
//               <Input
//                 heading="paragraph"
//                 value={formData.ctaText}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     ctaText: value,
//                   }))
//                 }
//                 onBlur={() =>
//                   setErrors((errs) => ({
//                     ...errs,
//                     ctaText: 'The Call To Action Text is required.',
//                   }))
//                 }
//                 placeholder="Call To Action Text"
//               />
//             </div>
//             <Info
//               direction="left"
//               info={{
//                 question: '	What is the CTA?',
//                 answer: '	The button text shown to guide users (e.g. Book Now).',
//               }}
//             />
//           </article>
//           <ImageUpload
//             label="Featured Image"
//             uploadPreset="havenova_upload"
//             cloudName="dd1i5d0iq"
//             initialImage={formData.featuredImage}
//             onUpload={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
//             width="600px"
//             aspectRatio={16 / 9}
//           />
//         </header>
//         {/* {formData.type === "SERVICE_DISCOUNT" && (
//           <>
//             <label>Applicable Services</label>
//             <div className={styles.serviceTypes}>
//               {formData.serviceTypes?.map((type, i) => (
//                 <span key={i} className={styles.serviceTag}>
//                   {type}{" "}
//                   <button type="button" onClick={() => removeServiceType(i)}>
//                     x
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <input
//               className={styles.label}
//               value={serviceInput}
//               onChange={(e) => setServiceInput(e.target.value)}
//               placeholder="e.g., plumbing"
//             />
//             <button type="button" onClick={addServiceType}>
//               + Add Service
//             </button>
//           </>
//         )} */}
//         <article className={styles.article}>
//           <label className={styles.label}>Discount percentage</label>
//           <div className={styles.percent_div}>
//             <input
//               className={styles.input}
//               type="number"
//               name="percentage"
//               min={1}
//               max={100}
//               value={formData.percentage || ''}
//               onChange={handleChange}
//               required
//             />
//             <label className={styles.label}>%</label>
//           </div>
//         </article>
//         <article className={styles.article}>
//           <div className={styles.div_small}>
//             <label className={styles.label}>Start Date</label>
//             <input
//               className={styles.date_input}
//               type="date"
//               name="startDate"
//               value={formData.startDate || ''}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <Info
//             direction="left"
//             info={{
//               question: 'When does it start?',
//               answer: 'The first day the offer becomes available.',
//             }}
//           />
//         </article>
//         <article className={styles.article}>
//           <div className={styles.div_small}>
//             <label className={styles.label}>End Date</label>
//             <input
//               className={styles.date_input}
//               type="date"
//               name="endDate"
//               value={formData.endDate || ''}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <Info
//             direction="left"
//             info={{
//               question: 'When does it end?',
//               answer: '	The last day the offer is valid.',
//             }}
//           />
//         </article>
//         <article className={styles.article}>
//           <div className={styles.div_small}>
//             <label className={styles.label}>Offer Type</label>
//             <SelectDashboard
//               label="Offer Type"
//               options={offerOptions}
//               defaultValue={formData.type}
//               onChange={(selected) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   type: selected as Offer['type'],
//                 }))
//               }
//             />
//           </div>
//           <Info
//             direction="left"
//             info={{
//               question: '	What type is this offer?',
//               answer: 'Defines the logic for when and how the offer is applied.',
//             }}
//           />
//         </article>
//         <article className={styles.article}>
//           <div className={styles.div_small}>
//             <label className={styles.label}>Redirect Page</label>
//             <SelectDashboard
//               label="Page to be redirected"
//               options={ctaOptions}
//               defaultValue={formData.ctaAction}
//               onChange={(selected) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   ctaAction: selected as Offer['ctaAction'],
//                 }))
//               }
//             />
//           </div>
//           <Info
//             direction="left"
//             info={{
//               question: 'Where does the CTA go?',
//               answer: 'The page where the user will be redirected after clicking the CTA.',
//             }}
//           />
//         </article>
//         <button className={styles.button} type="submit" disabled={loading}>
//           {loading ? 'Saving...' : editOffer ? 'Edit Offer' : 'Create Offer'}
//         </button>
//       </form>
//       <aside className={styles.section_aside}>
//         <h3>Offer Preview</h3>
//         <OfferCard offer={formData} preview />
//       </aside>
//     </section>
//   );
// };
// export default OfferForm;
