// utils/validators/furnitureFormValidator.ts

import {
  FurnitureAssemblyDetails,
  FurnitureServiceInput,
} from '../../../components/services/furnitureAssembly/furnitureAssemblyForm/furnitureAssembly.types';

export const validateFurnitureForm = (
  formData: FurnitureAssemblyDetails,
  input: FurnitureServiceInput
): string | null => {
  if (!formData.location) return 'Please select a location.';
  if (!formData.type) return 'Please select a furniture type.';
  if (!formData.quantity || formData.quantity <= 0) return 'Please specify a valid quantity.';

  if (input.width && (!formData.width || parseFloat(formData.width) <= 0))
    return 'Please enter a valid width.';
  if (input.height && (!formData.height || parseFloat(formData.height) <= 0))
    return 'Please enter a valid height.';
  if (input.depth && (!formData.depth || parseFloat(formData.depth) <= 0))
    return 'Please enter a valid depth.';

  if (input.doors && formData.doors! < 0) return 'Doors cannot be negative.';
  if (input.drawers && formData.drawers! < 0) return 'Drawers cannot be negative.';

  return null;
};
