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
    icon: '/images/components/services/furnitureAssembly/bedroom.webp',
    furniture: [
      {
        id: 'wardrobe',
        icon: '/images/components/services/furnitureAssembly/wardrobe.webp',
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
        icon: '/images/components/services/furnitureAssembly/bed_frame.webp',
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
        icon: '/images/components/services/furnitureAssembly/dresser.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'nightstand',
        icon: '/images/components/services/furnitureAssembly/nightstand.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'bookshelf',
        icon: '/images/components/services/furnitureAssembly/bookshelf.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'living_room',
    icon: '/images/components/services/furnitureAssembly/living_room.webp',
    furniture: [
      {
        id: 'tv_unit',
        icon: '/images/components/services/furnitureAssembly/tv_unit.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'coffee_table',
        icon: '/images/components/services/furnitureAssembly/coffee_table.webp',
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
        icon: '/images/components/services/furnitureAssembly/bookshelf.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'display_cabinet',
        icon: '/images/components/services/furnitureAssembly/display_cabinet.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'bathroom',
    icon: '/images/components/services/furnitureAssembly/bathroom.webp',
    furniture: [
      {
        id: 'bathroom_cabinet',
        icon: '/images/components/services/furnitureAssembly/bathroom_cabinet.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'mirror_cabinet',
        icon: '/images/components/services/furnitureAssembly/mirror_cabinet.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'shelf_unit',
        icon: '/images/components/services/furnitureAssembly/shelf_unit.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'kitchen',
    icon: '/images/components/services/furnitureAssembly/kitchen.webp',
    furniture: [
      {
        id: 'dining_table',
        icon: '/images/components/services/furnitureAssembly/dining_table.webp',
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
        icon: '/images/components/services/furnitureAssembly/dining_chair.webp',
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
        icon: '/images/components/services/furnitureAssembly/kitchen_island.webp',
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
        icon: '/images/components/services/furnitureAssembly/kitchen_cabinet.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'office',
    icon: '/images/components/services/furnitureAssembly/office.webp',
    furniture: [
      {
        id: 'desk',
        icon: '/images/components/services/furnitureAssembly/desk.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'office_chair',
        icon: '/images/components/services/furnitureAssembly/office_chair.webp',
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
        icon: '/images/components/services/furnitureAssembly/filing_cabinet.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'bookshelf',
        icon: '/images/components/services/furnitureAssembly/bookshelf.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
    ],
  },
  {
    location: 'hallway',
    icon: '/images/components/services/furnitureAssembly/hallway.webp',
    furniture: [
      {
        id: 'shoe_rack',
        icon: '/images/components/services/furnitureAssembly/shoe_rack.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'coat_rack',
        icon: '/images/components/services/furnitureAssembly/coat_rack.webp',
        input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
      },
      {
        id: 'console_table',
        icon: '/images/components/services/furnitureAssembly/console_table.webp',
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
    icon: '/images/components/services/furnitureAssembly/balcony.webp',
    furniture: [
      {
        id: 'outdoor_table',
        icon: '/images/components/services/furnitureAssembly/outdoor_table.webp',
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
        icon: '/images/components/services/furnitureAssembly/garden_chair.webp',
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
        icon: '/images/components/services/furnitureAssembly/plant_shelf.webp',
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
