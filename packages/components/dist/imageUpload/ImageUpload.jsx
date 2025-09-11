"use strict";
// import Image from 'next/image';
// import React, { useEffect, useRef, useState } from 'react';
// import styles from './ImageUpload.module.css';
// import { FaRegTrashCan } from 'react-icons/fa6';
// import ConfirmationAlert from '../confirmationAlert/ConfirmationAlert';
// interface ImageUploadProps {
//   label?: string;
//   onUpload: (url: string) => void;
//   uploadPreset: string;
//   cloudName: string;
//   initialImage?: string;
//   width?: string | number;
//   aspectRatio?: number;
// }
// export default function ImageUpload({
//   label = 'Upload Image',
//   onUpload,
//   uploadPreset,
//   cloudName,
//   initialImage = '',
//   width,
//   aspectRatio,
// }: ImageUploadProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [imageUrl, setImageUrl] = useState<string>(initialImage);
//   const [uploading, setUploading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [hover, setHover] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [dragActive, setDragActive] = useState(false);
//   useEffect(() => {
//     setImageUrl(initialImage || '');
//     if (!initialImage && fileInputRef.current) fileInputRef.current.value = '';
//   }, [initialImage]);
//   const handleFile = async (file: File) => {
//     setError(null);
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', uploadPreset);
//       const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       if (data.secure_url) {
//         setImageUrl(data.secure_url);
//         onUpload(data.secure_url);
//       } else {
//         setError('Upload failed');
//       }
//     } catch {
//       setError('An error occurred while uploading.');
//     } finally {
//       setUploading(false);
//     }
//   };
//   // For drag & drop
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) {
//       handleFile(file);
//     }
//   };
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(true);
//   };
//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragActive(false);
//   };
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       handleFile(file);
//     }
//   };
//   return (
//     <main
//       className={styles.main}
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onClick={() => {
//         imageUrl ? null : fileInputRef.current?.click();
//       }}
//     >
//       {imageUrl ? (
//         <>
//           <button
//             type="button"
//             className={styles.deleteButton}
//             onMouseEnter={() => {
//               setTimeout(() => {
//                 setHover(true);
//               }, 400);
//             }}
//             onMouseLeave={() => setHover(false)}
//             onClick={() => setOpen(true)}
//           >
//             <FaRegTrashCan />
//           </button>
//           <section
//             style={{
//               width: typeof width === 'number' ? `${width}px` : width || '100%',
//               aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
//               position: 'relative',
//               overflow: 'hidden',
//               borderRadius: '8px',
//             }}
//             className={styles.image_section}
//           >
//             <Image
//               src={imageUrl}
//               priority={true}
//               alt="Uploaded"
//               fill
//               style={{ objectFit: 'cover' }}
//             />
//             {open && (
//               <ConfirmationAlert
//                 title="Are you sure you want to delete this image?"
//                 message=""
//                 onCancel={() => setOpen(false)}
//                 onConfirm={() => {
//                   setImageUrl('');
//                   onUpload('');
//                   setHover(false);
//                   if (fileInputRef.current) fileInputRef.current.value = '';
//                   setOpen(false);
//                 }}
//               />
//             )}
//           </section>
//         </>
//       ) : (
//         <section
//           style={{
//             width: typeof width === 'number' ? `${width}px` : width || '100%',
//             aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
//           }}
//           onMouseEnter={() => setDragActive(true)}
//           onMouseLeave={() => setDragActive(false)}
//           className={`${styles.input_section} ${dragActive ? styles.section_active : ''}`}
//         >
//           <div className={styles.images}>
//             <Image
//               className={`${styles.image_left} ${dragActive ? styles.image_left_active : ''}`}
//               src="/svg/image_icon.svg"
//               priority={true}
//               alt="Image Icon"
//               width={50}
//               height={50}
//             />
//             <Image
//               className={styles.image_top}
//               src="/svg/image_icon.svg"
//               priority={true}
//               alt="Image Icon"
//               width={80}
//               height={80}
//             />
//             <Image
//               className={`${styles.image_right} ${dragActive ? styles.image_right_active : ''}`}
//               src="/svg/image_icon.svg"
//               priority={true}
//               alt="Image Icon"
//               width={50}
//               height={50}
//             />
//           </div>
//           {uploading ? (
//             <Loading />
//           ) : (
//             <div className={styles.section_div}>
//               <p className={styles.p}>Drop an image here, or click to select</p>
//               <p className="button_invert">Upload</p>
//             </div>
//           )}
//         </section>
//       )}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         style={{ display: 'none' }}
//         onChange={handleFileChange}
//       />
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//     </main>
//   );
// }
