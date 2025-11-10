import { FurnitureAssemblyDetails, FurnitureServiceInput } from './furnitureAssembly.types';

export const initialFormData: FurnitureAssemblyDetails = {
  title: '',
  icon: '',
  type: '',
  location: '',
  quantity: 1,
  position: 'floor',
  width: '',
  height: '',
  depth: '',
  doors: 0,
  drawers: 0,
  notes: '',
};

export const furnitureTypes: {
  location: string;
  icon: string;
  furniture: { id: string; icon: string; input: FurnitureServiceInput }[];
}[] = [
  {
    location: 'bedroom',
    icon: '/svg/components/furnitureAssembly/bed_frame.svg',
    furniture: [
      {
        id: 'wardrobe',
        icon: '/svg/components/furnitureAssembly/wardrobe.svg',
        input: {
          width: true,
          height: true,
          depth: true,
          doors: true,
          drawers: true,
          wall: false,
        },
      },
      {
        id: 'bed_frame',
        icon: '/svg/components/furnitureAssembly/bed_frame.svg',
        input: {
          width: true,
          height: false,
          depth: true,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'dresser',
        icon: '/svg/components/furnitureAssembly/dresser.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'nightstand',
        icon: '/svg/components/furnitureAssembly/nightstand.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'bookshelf',
        icon: '/svg/components/furnitureAssembly/bookshelf.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'living_room',
    icon: '/svg/components/furnitureAssembly/living_room.svg',
    furniture: [
      {
        id: 'tv_unit',
        icon: '/svg/components/furnitureAssembly/tv_unit.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'coffee_table',
        icon: '/svg/components/furnitureAssembly/coffee_table.svg',
        input: {
          width: true,
          height: true,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'bookshelf',
        icon: '/svg/components/furnitureAssembly/bookshelf.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'display_cabinet',
        icon: '/svg/components/furnitureAssembly/display_cabinet.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'bathroom',
    icon: '/svg/components/furnitureAssembly/bathroom.svg',
    furniture: [
      {
        id: 'bathroom_cabinet',
        icon: '/svg/components/furnitureAssembly/bathroom_cabinet.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'mirror_cabinet',
        icon: '/svg/components/furnitureAssembly/mirror_cabinet.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'shelf_unit',
        icon: '/svg/components/furnitureAssembly/shelf_unit.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'kitchen',
    icon: '/svg/components/furnitureAssembly/kitchen.svg',
    furniture: [
      {
        id: 'dining_table',
        icon: '/svg/components/furnitureAssembly/dining_table.svg',
        input: {
          width: true,
          height: true,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'dining_chair',
        icon: '/svg/components/furnitureAssembly/dining_chair.svg',
        input: {
          width: false,
          height: false,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'kitchen_island',
        icon: '/svg/components/furnitureAssembly/kitchen_island.svg',
        input: {
          width: true,
          height: true,
          depth: true,
          doors: true,
          drawers: true,
          wall: false,
        },
      },
      {
        id: 'kitchen_cabinet',
        icon: '/svg/components/furnitureAssembly/kitchen_cabinet.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'office',
    icon: '/svg/components/furnitureAssembly/office.svg',
    furniture: [
      {
        id: 'desk',
        icon: '/svg/components/furnitureAssembly/desk.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'office_chair',
        icon: '/svg/components/furnitureAssembly/office_chair.svg',
        input: {
          width: false,
          height: false,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'filing_cabinet',
        icon: '/svg/components/furnitureAssembly/filing_cabinet.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'bookshelf',
        icon: '/svg/components/furnitureAssembly/bookshelf.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'hallway',
    icon: '/svg/components/furnitureAssembly/hallway.svg',
    furniture: [
      {
        id: 'shoe_rack',
        icon: '/svg/components/furnitureAssembly/shoe_rack.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'coat_rack',
        icon: '/svg/components/furnitureAssembly/coat_rack.svg',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'console_table',
        icon: '/svg/components/furnitureAssembly/console_table.svg',
        input: {
          width: true,
          height: true,
          depth: true,
          doors: true,
          drawers: true,
          wall: false,
        },
      },
    ],
  },
  {
    location: 'balcony',
    icon: '/svg/components/furnitureAssembly/balcony.svg',
    furniture: [
      {
        id: 'outdoor_table',
        icon: '/svg/components/furnitureAssembly/outdoor_table.svg',
        input: {
          width: true,
          height: true,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'garden_chair',
        icon: '/svg/components/furnitureAssembly/garden_chair.svg',
        input: {
          width: false,
          height: false,
          depth: false,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
      {
        id: 'plant_shelf',
        icon: '/svg/components/furnitureAssembly/plant_shelf.svg',
        input: {
          width: true,
          height: true,
          depth: true,
          doors: false,
          drawers: false,
          wall: false,
        },
      },
    ],
  },
];

export const getServiceInputSchema = (
  serviceGroups: any[],
  location: string,
  type: string
): FurnitureServiceInput => {
  const group = serviceGroups.find((g) => g.location === location);
  const item = group?.furniture?.find((f: any) => f.id === type);

  return (
    item?.input || {
      width: false,
      height: false,
      depth: false,
      doors: false,
      drawers: false,
      wall: false,
    }
  );
};
