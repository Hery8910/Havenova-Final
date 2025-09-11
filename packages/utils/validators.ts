// import {
//   FurnitureAssemblyDetailsForm,
//   furnitureServiceInput,
// } from '../components/services/furnitureAssembly/furnitureAssemblyForm/FurnitureAssemblyForm';
// import { BlogPost } from '../types/blog';

// // validators.ts
// export const isNameValid = (name: string): boolean =>
//   /^[A-Z][a-zA-Z- äöü' ]{1,49}$/.test(name.trim());

// export const isEmailValid = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// export const isPhoneValid = (phone: string): boolean => /^(\+49|0)\d{8,12}$/.test(phone);

// export const isPasswordValid = (password: string): boolean =>
//   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// export const isAddressValid = (address: string): boolean =>
//   /^[a-zA-Z0-9\s,'-.#]{5,49}$/.test(address.trim());

// export const isServiceAddressValid = (serviceAddress: string): boolean =>
//   /^[a-zA-Z0-9\s,'-.#]{5,49}$/.test(serviceAddress.trim());

// export const validateField = (name: string, value: string): string => {
//   if (name === 'name' && !isNameValid(value)) {
//     return 'The name must begin with a capital letter and contain only letters, spaces, hyphens, or apostrophes.';
//   } else if (name === 'email' && !isEmailValid(value)) {
//     return 'The email is not valid';
//   } else if (name === 'phone' && !isPhoneValid(value)) {
//     return 'The phone number is not valid';
//   } else if (name === 'password' && !isPasswordValid(value)) {
//     return 'The password must be at least 8 characters, one uppercase letter, one number, and one special character.';
//   } else if (name === 'address' && !isAddressValid(value)) {
//     return 'The address can only contain letters, numbers, spaces, commas, and hyphens.';
//   }
//   return '';
// };

// export const validateFurnitureForm = (
//   formData: FurnitureAssemblyDetailsForm,
//   input: furnitureServiceInput
// ): string | null => {
//   if (input.width) {
//     if (!formData.width || isNaN(Number(formData.width)) || Number(formData.width) <= 0) {
//       return 'Please enter a valid width (must be a positive number).';
//     }
//   }

//   if (input.height) {
//     if (!formData.height || isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
//       return 'Please enter a valid height (must be a positive number).';
//     }
//   }

//   if (input.depth) {
//     if (!formData.depth || isNaN(Number(formData.depth)) || Number(formData.depth) <= 0) {
//       return 'Please enter a valid depth (must be a positive number).';
//     }
//   }

//   return null; // ✅ All validations passed
// };

// export function validateTitle(title: string): string | null {
//   if (!title.trim()) return 'The title is required.';
//   if (title.length < 5) return 'The title must be at least 5 characters.';
//   if (title.length > 120) return 'The title must be less than 120 characters.';
//   return null;
// }

// export function validateSlug(slug: string, blogs: BlogPost[]): string | null {
//   const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
//   if (!slug.trim()) return 'The slug is required.';
//   if (!slugPattern.test(slug)) {
//     return 'The slug must use only lowercase letters, numbers, and hyphens (no spaces or special characters). It cannot start or end with a hyphen or have double hyphens.';
//   }
//   if (blogs.some((blog) => blog.slug === slug))
//     return 'This slug is already in use. Please choose another.';
//   return null;
// }

// export function validateMetaDescription(metaDescription: string): string | null {
//   if (!metaDescription.trim()) return 'The meta description is required.';
//   if (metaDescription.length < 60) return 'The meta description should be at least 60 characters.';
//   if (metaDescription.length > 160)
//     return 'The meta description should be less than 160 characters.';
//   return null;
// }

// export function validateFeaturedImage(url: string): string | null {
//   if (!url.trim()) return 'A featured image is required.';
//   // Optional: check URL is likely an image
//   if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
//     return 'Please provide a valid image URL (jpg, png, webp, or gif).';
//   }
//   return null;
// }

// export function validateIntroduction(introduction: string): string | null {
//   if (!introduction.trim()) return 'The introduction is required.';
//   if (introduction.length < 20) return 'The introduction should be at least 20 characters.';
//   return null;
// }
