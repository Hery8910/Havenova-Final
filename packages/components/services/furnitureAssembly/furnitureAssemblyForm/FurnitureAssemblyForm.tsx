'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './FurnitureAssemblyForm.module.css';
import Image from 'next/image';
import {
  saveRequestItemToStorage,
  updateRequestItemInStorage,
} from '@havenova/utils/serviceRequest';
import { validateFurnitureForm } from '@/packages/utils/validators/servicesValidators';
import { useI18n } from '../../../../contexts/i18n';
import { useUser } from '../../../../contexts/user';
import { Button } from '../../../common';
import { Loading } from '../../../loading';
import { AlertWrapper } from '../../../alert';
import {
  BaseServiceDetails,
  FurnitureAssemblyDetails,
  FurnitureAssemblyRequest,
  ServiceIcon,
  ServiceRequestItem,
} from '../../../../types';
import { useEffect } from 'react';

// export interface FurnitureAssemblyDetailsForm {
//   id: string;
//   title: string;
//   icon: ServiceIcon;
//   notes?: string;
//   type: string /*  */;
//   location: string;
//   quantity: number;
//   position: 'floor' | 'wall';
//   width?: string;
//   height?: string;
//   depth?: string;
//   doors?: number;
//   drawers?: number;
// }
export interface furnitureServiceInput {
  width: boolean;
  height: boolean;
  depth: boolean;
  doors: boolean;
  drawers: boolean;
  wall: boolean;
}
interface Props {
  request?: FurnitureAssemblyDetails;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FurnitureAssemblyForm = ({ request, setEdit }: Props) => {
  const furnitureTypes = [
    {
      location: 'bedroom',
      icon: {
        src: '/images/components/services/furnitureAssembly/bedroom.webp',
        alt: 'Schlafzimmer Symbol',
      },
      furniture: [
        {
          id: 'wardrobe',
          label: 'wardrobe',
          icon: {
            src: '/images/components/services/furnitureAssembly/wardrobe.webp',
            alt: 'Kleiderschrank Symbol',
          },
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
          label: 'bed_frame',
          icon: {
            src: '/images/components/services/furnitureAssembly/bed_frame.webp',
            alt: 'Bettgestell Symbol',
          },
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
          label: 'dresser',
          icon: {
            src: '/images/components/services/furnitureAssembly/dresser.webp',
            alt: 'Kommode Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'nightstand',
          label: 'nightstand',
          icon: {
            src: '/images/components/services/furnitureAssembly/nightstand.webp',
            alt: 'Nachttisch Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'bookshelf',
          label: 'bookshelf',
          icon: {
            src: '/images/components/services/furnitureAssembly/bookshelf.webp',
            alt: 'Bücherregal Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
      ],
    },
    {
      location: 'living_room',
      icon: {
        src: '/images/components/services/furnitureAssembly/living_room.webp',
        alt: 'Wohnzimmer Symbol',
      },
      furniture: [
        {
          id: 'tv_unit',
          label: 'tv_unit',
          icon: {
            src: '/images/components/services/furnitureAssembly/tv_unit.webp',
            alt: 'TV-Möbel Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'coffee_table',
          label: 'coffee_table',
          icon: {
            src: '/images/components/services/furnitureAssembly/coffee_table.webp',
            alt: 'Couchtisch Symbol',
          },
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
          label: 'bookshelf',
          icon: {
            src: '/images/components/services/furnitureAssembly/bookshelf.webp',
            alt: 'Bücherregal Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'display_cabinet',
          label: 'display_cabinet',
          icon: {
            src: '/images/components/services/furnitureAssembly/display_cabinet.webp',
            alt: 'Vitrine Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
      ],
    },
    {
      location: 'bathroom',
      icon: {
        src: '/images/components/services/furnitureAssembly/bathroom.webp',
        alt: 'Badezimmer Symbol',
      },
      furniture: [
        {
          id: 'bathroom_cabinet',
          label: 'bathroom_cabinet',
          icon: {
            src: '/images/components/services/furnitureAssembly/bathroom_cabinet.webp',
            alt: 'Badezimmerschrank Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'mirror_cabinet',
          label: 'mirror_cabinet',
          icon: {
            src: '/images/components/services/furnitureAssembly/mirror_cabinet.webp',
            alt: 'Spiegelschrank Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'shelf_unit',
          label: 'shelf_unit',
          icon: {
            src: '/images/components/services/furnitureAssembly/shelf_unit.webp',
            alt: 'Regaleinheit Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
      ],
    },
    {
      location: 'kitchen',
      icon: {
        src: '/images/components/services/furnitureAssembly/kitchen.webp',
        alt: 'Küche Symbol',
      },
      furniture: [
        {
          id: 'dining_table',
          label: 'dining_table',
          icon: {
            src: '/images/components/services/furnitureAssembly/dining_table.webp',
            alt: 'Esstisch Symbol',
          },
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
          label: 'dining_chair',
          icon: {
            src: '/images/components/services/furnitureAssembly/dining_chair.webp',
            alt: 'Essstuhl Symbol',
          },
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
          label: 'kitchen_island',
          icon: {
            src: '/images/components/services/furnitureAssembly/kitchen_island.webp',
            alt: 'Kücheninsel Symbol',
          },
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
          label: 'kitchen_cabinet',
          icon: {
            src: '/images/components/services/furnitureAssembly/kitchen_cabinet.webp',
            alt: 'Küchenschrank Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
      ],
    },
    {
      location: 'office',
      icon: {
        src: '/images/components/services/furnitureAssembly/office.webp',
        alt: 'Büro Symbol',
      },
      furniture: [
        {
          id: 'desk',
          label: 'desk',
          icon: {
            src: '/images/components/services/furnitureAssembly/desk.webp',
            alt: 'Schreibtisch Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'office_chair',
          label: 'office_chair',
          icon: {
            src: '/images/components/services/furnitureAssembly/office_chair.webp',
            alt: 'Bürostuhl Symbol',
          },
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
          label: 'filing_cabinet',
          icon: {
            src: '/images/components/services/furnitureAssembly/filing_cabinet.webp',
            alt: 'Aktenschrank Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'bookshelf',
          label: 'bookshelf',
          icon: {
            src: '/images/components/services/furnitureAssembly/bookshelf.webp',
            alt: 'Bücherregal Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
      ],
    },
    {
      location: 'hallway',
      icon: {
        src: '/images/components/services/furnitureAssembly/hallway.webp',
        alt: 'Flur Symbol',
      },
      furniture: [
        {
          id: 'shoe_rack',
          label: 'shoe_rack',
          icon: {
            src: '/images/components/services/furnitureAssembly/shoe_rack.webp',
            alt: 'Schuhregal Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'coat_rack',
          label: 'coat_rack',
          icon: {
            src: '/images/components/services/furnitureAssembly/coat_rack.webp',
            alt: 'Garderobe Symbol',
          },
          input: { width: true, height: true, depth: true, doors: true, drawers: true, wall: true },
        },
        {
          id: 'console_table',
          label: 'console_table',
          icon: {
            src: '/images/components/services/furnitureAssembly/console_table.webp',
            alt: 'Konsolentisch Symbol',
          },
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
      icon: {
        src: '/images/components/services/furnitureAssembly/balcony.webp',
        alt: 'Balkon Symbol',
      },
      furniture: [
        {
          id: 'outdoor_table',
          label: 'outdoor_table',
          icon: {
            src: '/images/components/services/furnitureAssembly/outdoor_table.webp',
            alt: 'Gartentisch Symbol',
          },
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
          label: 'garden_chair',
          icon: {
            src: '/images/components/services/furnitureAssembly/garden_chair.webp',
            alt: 'Gartenstuhl Symbol',
          },
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
          label: 'plant_shelf',
          icon: {
            src: '/images/components/services/furnitureAssembly/plant_shelf.webp',
            alt: 'Pflanzenregal Symbol',
          },
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
  const { texts } = useI18n();
  const furnitureAssembly = texts?.components?.services?.furnitureAssembly;

  const { user, refreshUser } = useUser();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [icon, setIcon] = useState<ServiceIcon>({ src: '', alt: '' });
  const [input, setInput] = useState<furnitureServiceInput>({
    width: true,
    height: true,
    depth: true,
    doors: true,
    drawers: true,
    wall: true,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FurnitureAssemblyDetails>(() => ({
    id: request?.id || '',
    title: request?.title || '',
    icon: request?.icon || { src: '', alt: '' },
    type: request?.type || '',
    location: request?.location || '',
    quantity: request?.quantity || 1,
    position: request?.position || 'floor',
    width: request?.width || '',
    height: request?.height || '',
    depth: request?.depth || '',
    doors: request?.doors || 0,
    drawers: request?.drawers || 0,
    notes: request?.notes || '',
  }));

  useEffect(() => {
    if (request) {
      setSelectedItem(request?.type);
      setSelectedLocation(request?.location);
      setFormData({
        id: request?.id,
        title: request?.title,
        icon: request?.icon,
        type: request?.type,
        location: request?.location,
        quantity: request?.quantity,
        position: request?.position,
        width: request?.width,
        height: request?.height,
        depth: request?.depth,
        doors: request?.doors,
        drawers: request?.drawers,
        notes: request?.notes,
      });
    }
  }, [request]);

  const handleSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const activeGroup = furnitureTypes.find((group) => group.location === selectedLocation);

  const handleClick = (label: string, icon: ServiceIcon, input: furnitureServiceInput) => {
    setSelectedItem(label);
    setInput(input);
    setIcon(icon);
    setFormData((prev) => ({
      ...prev,
      title: 'Furniture Assembly',
      icon,
      type: label,
      location: selectedLocation,
      position: 'floor',
      quantity: 1, // ✅ como número
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const typedValue = type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;
    if (name in formData) {
      setFormData((prev: FurnitureAssemblyDetails) => ({
        ...prev,
        [name]: typedValue,
        title: 'Furniture Assembly',
        icon: {
          src: icon.src,
          alt: icon.alt,
        },
        type: selectedItem,
        location: selectedLocation,
      }));
    }
  };

  const handleAdjust = (field: 'doors' | 'drawers' | 'quantity', action: 'add' | 'subtract') => {
    setFormData((prev) => {
      const current = prev[field] || 0;
      const updated = action === 'add' ? current + 1 : Math.max(0, current - 1);
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateFurnitureForm(formData, input);
    if (error) {
      setAlert({
        status: 400,
        title: 'Invalid data',
        description: error,
      });
      return;
    }
    const newRequest: FurnitureAssemblyRequest = {
      id: uuidv4(),
      serviceType: 'furniture-assembly',
      price: 0,
      estimatedDuration: 0,
      icon: formData.icon,
      details: {
        ...formData,
      },
    };
    try {
      if (request?.id) {
        updateRequestItemInStorage(request.id, newRequest);
        setAlert({
          status: 200,
          title: 'Request updated',
          description: 'Your service request was successfully updated.',
        });
        if (setEdit) setEdit(false);
      } else {
        saveRequestItemToStorage(newRequest);
        setAlert({
          status: 200,
          title: 'Request saved',
          description: 'Your service request was added successfully.',
        });
        setSelectedItem('');
        setSelectedLocation('');
        setFormData({
          id: '',
          title: '',
          icon: { src: '', alt: '' },
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
        });
      }
    } catch (err) {
      setAlert({
        status: 500,
        title: 'Error',
        description: 'There was an error saving your request.',
      });
    }
  };

  return (
    <section className={styles.main}>
      <header className={styles.main_header}>
        <aside className={styles.header_aside}>
          <Image
            className={styles.location_image}
            src={furnitureAssembly.form.header.img.src}
            priority={true}
            alt={furnitureAssembly.form.header.img.alt}
            width={35}
            height={35}
          />
          <p>{furnitureAssembly.form.header.title}</p>
        </aside>
        <h2>{furnitureAssembly.steps[currentStep].title}</h2>
        <p>{furnitureAssembly.steps[currentStep].description}</p>
      </header>
      <ul className={`${styles.ul_main} card`}>
        {!selectedLocation && (
          <li className={styles.li}>
            <header className={styles.li_header}>
              <h4 className={styles.h4}>{furnitureAssembly.steps[currentStep].step}</h4>
              <p className={styles.header_p}>1/3</p>
            </header>
            <ul className={styles.ul}>
              {furnitureTypes.map((group) => (
                <li
                  key={group.location}
                  onClick={() => {
                    handleSelect(group.location);
                    setCurrentStep(currentStep + 1);
                  }}
                  className={styles.location_button}
                >
                  <Image
                    className={styles.location_image}
                    src={group.icon.src}
                    priority={true}
                    alt={group.icon.alt}
                    width={35}
                    height={35}
                  />
                  <p className={styles.location_p}>{furnitureAssembly.locations[group.location]}</p>
                </li>
              ))}
            </ul>
          </li>
        )}
        {selectedLocation && !selectedItem && (
          <li className={styles.li}>
            <header className={styles.li_header}>
              <h4 className={styles.h4}>{furnitureAssembly.steps[currentStep].step}</h4>
              <p className={styles.header_p}>2/3</p>
            </header>
            {activeGroup && (
              <ul className={styles.ul}>
                {activeGroup.furniture.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      handleClick(item.label, item.icon, item.input);
                      setCurrentStep(currentStep + 1);
                    }}
                    className={styles.location_button}
                  >
                    <Image
                      className={styles.li_image}
                      src={item.icon.src}
                      priority={true}
                      alt={item.icon.alt}
                      width={35}
                      height={35}
                    />
                    <p className={styles.location_p}>{furnitureAssembly.furniture[item.label]}</p>
                  </li>
                ))}
              </ul>
            )}
            <Button
              cta={furnitureAssembly.form.back_button.cta}
              variant={furnitureAssembly.form.back_button.variant}
              icon={furnitureAssembly.form.back_button.icon}
              onClick={() => {
                setSelectedLocation('');
                setCurrentStep(currentStep - 1);
              }}
            />
          </li>
        )}
        {selectedLocation && selectedItem && (
          <li className={styles.li}>
            <header className={styles.li_header}>
              <h4 className={styles.h4}>{furnitureAssembly.steps[currentStep].step}</h4>
              <p className={styles.header_p}>3/3</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.form_div}>
                <label className={styles.label}>{furnitureAssembly.form.input.quantity}</label>
                <div className={styles.counter}>
                  <button
                    className={styles.rest_button}
                    type="button"
                    onClick={() => handleAdjust('quantity', 'subtract')}
                  >
                    -
                  </button>
                  <p className={styles.counter_p}>{formData.quantity}</p>
                  <button
                    className={styles.add_button}
                    type="button"
                    onClick={() => handleAdjust('quantity', 'add')}
                  >
                    +
                  </button>
                </div>
              </div>

              {input.width && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.width}</label>
                  <div className={styles.div}>
                    <input
                      className={styles.input}
                      type="number"
                      name="width"
                      value={formData.width || ''}
                      onChange={handleChange}
                      placeholder="0"
                    />
                    <label className={styles.label}>cm</label>
                  </div>
                </div>
              )}

              {input.height && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.height}</label>
                  <div className={styles.div}>
                    <input
                      className={styles.input}
                      type="number"
                      name="height"
                      value={formData.height || ''}
                      onChange={handleChange}
                      placeholder="0"
                    />
                    <label className={styles.label}>cm</label>
                  </div>
                </div>
              )}

              {input.depth && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.depth}</label>
                  <div className={styles.div}>
                    <input
                      className={styles.input}
                      type="number"
                      name="depth"
                      value={formData.depth || ''}
                      onChange={handleChange}
                      placeholder="0"
                    />
                    <label className={styles.label}>cm</label>
                  </div>
                </div>
              )}

              {input.doors && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.doors}</label>
                  <div className={styles.counter}>
                    <button
                      className={styles.rest_button}
                      type="button"
                      onClick={() => handleAdjust('doors', 'subtract')}
                    >
                      -
                    </button>
                    <p className={styles.counter_p}>{formData.doors}</p>
                    <button
                      className={styles.add_button}
                      type="button"
                      onClick={() => handleAdjust('doors', 'add')}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {input.drawers && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.drawers}</label>
                  <div className={styles.counter}>
                    <button
                      className={styles.rest_button}
                      type="button"
                      onClick={() => handleAdjust('drawers', 'subtract')}
                    >
                      -
                    </button>
                    <p className={styles.counter_p}>{formData.drawers}</p>
                    <button
                      className={styles.add_button}
                      type="button"
                      onClick={() => handleAdjust('drawers', 'add')}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {input.wall && (
                <div className={styles.form_div}>
                  <label className={styles.label}>{furnitureAssembly.form.input.wall}</label>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={formData.position === 'wall'}
                      onChange={(e) =>
                        setFormData((prev: FurnitureAssemblyDetails) => ({
                          ...prev,
                          position: e.target.checked ? 'wall' : 'floor',
                        }))
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              )}

              <textarea
                className={styles.textarea}
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder={furnitureAssembly.form.input.comment}
              />
              <div className={styles.button_div}>
                <Button
                  cta={furnitureAssembly.form.back_button.cta}
                  variant={furnitureAssembly.form.back_button.variant}
                  icon={furnitureAssembly.form.back_button.icon}
                  onClick={() => {
                    setSelectedItem('');
                    setCurrentStep(currentStep - 1);
                  }}
                />
                <Button
                  cta={furnitureAssembly.form.submit_button.cta}
                  variant={furnitureAssembly.form.submit_button.variant}
                  icon={furnitureAssembly.form.submit_button.icon}
                  type="submit"
                />
              </div>
            </form>
          </li>
        )}
      </ul>
      {loading && <Loading theme={user?.theme || 'light'} />}
      {!loading && alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </section>
  );
};

export default FurnitureAssemblyForm;
