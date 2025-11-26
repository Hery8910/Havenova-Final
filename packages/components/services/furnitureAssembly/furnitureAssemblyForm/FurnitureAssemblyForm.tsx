'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './FurnitureAssemblyForm.module.css';
import Image from 'next/image';
import { furnitureTypes, getServiceInputSchema, initialFormData } from './furnitureAssembly.data';
import {
  saveRequestItemToStorage,
  updateRequestItemInStorage,
} from '@havenova/utils/serviceRequest';
import { validateFurnitureForm } from '@havenova/utils/validators/servicesValidators';
import { useI18n } from '@havenova/contexts/i18n';
import { useServiceCart } from '@havenova/contexts/serviceCart/ServiceCartContext';
import {
  FurnitureAssemblyDetails,
  FurnitureAssemblyRequest,
  FurnitureServiceInput,
} from './furnitureAssembly.types';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useGlobalAlert } from '@havenova/contexts/alert/AlertContext';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../hooks/useLang';
import { href } from '../../../../utils/navigation';
import { ImageUploader } from '../../../imageUploader';
import { useClient } from '../../../../contexts/client/ClientContext';

interface Props {
  request?: FurnitureAssemblyRequest;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
  onUpdated?: () => void;
}

const FurnitureAssemblyForm = ({ request, setEdit, onUpdated }: Props) => {
  const { client } = useClient();
  const clientId = client?._id;
  const { texts } = useI18n();
  const furnitureAssembly = texts?.components?.services?.furnitureAssembly;
  const { error: errorTexts, confirmation: confirmationTexts } =
    texts?.components?.services?.furnitureAssembly.form.alerts;
  const router = useRouter();
  const lang = useLang();
  const { reload } = useServiceCart();

  const { showError, showSuccess, showConfirm, closeAlert } = useGlobalAlert();
  const [requestId, setRequestId] = useState<string>(request?.id || uuidv4());

  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [icon, setIcon] = useState<string>(request?.details.icon || '');
  const [input, setInput] = useState<FurnitureServiceInput>({
    width: true,
    height: true,
    depth: true,
    doors: true,
    drawers: true,
    wall: true,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FurnitureAssemblyDetails>(
    request?.details || initialFormData
  );

  useEffect(() => {
    if (request) {
      setSelectedItem(request.details.type);
      setSelectedLocation(request.details.location);
      setCurrentStep(2);
      setFormData(request.details);

      const schema = getServiceInputSchema(
        furnitureTypes,
        request.details.location,
        request.details.type
      );
      setInput(schema); // ✅ input ahora tiene tipado seguro
    }
  }, [request]);

  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    setCurrentStep(1);
  };

  const handleClick = (id: string, icon: string, input: FurnitureServiceInput) => {
    setSelectedItem(id);
    setInput(input);
    setIcon(icon);
    setFormData((prev) => ({
      ...prev,
      title: 'Furniture Assembly',
      icon,
      type: id,
      location: selectedLocation,
      position: 'floor',
      quantity: 1,
    }));
    setCurrentStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const typedValue = type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: typedValue }));
  };

  const handleAdjust = (field: 'doors' | 'drawers' | 'quantity', action: 'add' | 'subtract') => {
    setFormData((prev) => {
      const updated =
        action === 'add' ? (prev[field] || 0) + 1 : Math.max(0, (prev[field] || 0) - 1);
      return { ...prev, [field]: updated };
    });
  };

  const handleImagesChange = useCallback((urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: urls,
    }));
  }, []);

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    if (currentStep === 1) setSelectedLocation('');
    if (currentStep === 2) setSelectedItem('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateFurnitureForm(formData, input);
    if (error) {
      showError({
        response: {
          status: 400,
          title: errorTexts.invalid.title,
          description: errorTexts.invalid.description,
          cancelLabel: confirmationTexts.close,
        },
        onCancel: closeAlert,
      });
      return;
    }

    const newRequest: FurnitureAssemblyRequest = {
      id: requestId,
      serviceType: 'furniture-assembly',
      price: 0,
      estimatedDuration: 0,
      icon: formData.icon,
      details: { ...formData },
    };

    try {
      if (request?.id) {
        // 🔹 Caso edición
        updateRequestItemInStorage(request.id, newRequest);
        reload();
        showSuccess({
          response: {
            status: 200,
            title: confirmationTexts.title.edit,
            description: confirmationTexts.description.edit,
            cancelLabel: confirmationTexts.close,
          },
          onCancel: () => {
            setEdit?.(false);
            closeAlert();
            onUpdated?.();
          },
        });
      } else {
        // 🔹 Caso creación
        saveRequestItemToStorage(newRequest);
        reload();
        showConfirm({
          response: {
            status: 200,
            title: confirmationTexts.title.create,
            description: confirmationTexts.description.create,
            confirmLabel: confirmationTexts.confirm,
            cancelLabel: confirmationTexts.cancel,
          },
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/checkout'));
          },
          onCancel: closeAlert,
        });

        setSelectedItem('');
        setRequestId('');
        setSelectedLocation('');
        setFormData(initialFormData);
        setCurrentStep(0);
      }
    } catch (err) {
      console.error(err);
      showError({
        response: {
          status: 500,
          title: errorTexts.unexpected.title,
          description: errorTexts.unexpected.description,
          cancelLabel: confirmationTexts.close,
        },
        onCancel: closeAlert,
      });
    }
  };

  const activeGroup = furnitureTypes.find((group) => group.location === selectedLocation);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.header_div}>
          <p className={styles.header_p}>{currentStep + 1}/3</p>
          <h4 className={styles.h4}>{furnitureAssembly.steps[currentStep].step}</h4>
        </div>
        <button
          className={`${styles.back_button} ${!selectedLocation ? styles.hidden_button : ''}`}
          onClick={selectedLocation ? handleBack : undefined}
          disabled={!selectedLocation}
        >
          <IoIosArrowBack /> {furnitureAssembly.form.back_button}
        </button>
      </header>

      <ul className={styles.ul_main}>
        {/* Step 1: Select location */}
        {!selectedLocation && (
          <li className={styles.li}>
            <ul className={styles.ul}>
              {furnitureTypes.map((group) => (
                <li
                  key={group.location}
                  onClick={() => handleSelect(group.location)}
                  className={styles.location_li}
                >
                  <div className={styles.location_div}>
                    <Image src={group.icon} alt="" width={40} height={40} className={styles.icon} />
                    <p className={styles.location_p}>
                      {furnitureAssembly.locations[group.location]}
                    </p>
                  </div>
                  {/* <IoIosArrowForward className={styles.arrow} /> */}
                </li>
              ))}
            </ul>
          </li>
        )}

        {/* Step 2: Select furniture type */}
        {selectedLocation && !selectedItem && activeGroup && (
          <li className={styles.li}>
            <ul className={styles.ul}>
              {activeGroup.furniture.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleClick(item.id, item.icon, item.input)}
                  className={styles.location_li}
                >
                  <div className={styles.location_div}>
                    <Image src={item.icon} alt="" width={40} height={40} className={styles.icon} />
                    <p className={styles.location_p}>{furnitureAssembly.furniture[item.id]}</p>
                  </div>
                  <IoIosArrowForward className={styles.arrow} />
                </li>
              ))}
            </ul>
          </li>
        )}

        {/* Step 3: Fill details */}
        {selectedLocation && selectedItem && (
          <li className={styles.li}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Cantidad */}
              <div className={styles.details_div}>
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

                {/* Medidas, detalles, etc */}
                {input.width && (
                  <div className={styles.form_div}>
                    <label className={styles.label}>{furnitureAssembly.form.input.width}</label>
                    <div className={styles.input_div}>
                      <input
                        className={styles.input}
                        type="number"
                        name="width"
                        value={formData.width || ''}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <p>cm</p>
                    </div>
                  </div>
                )}
                {input.height && (
                  <div className={styles.form_div}>
                    <label className={styles.label}>{furnitureAssembly.form.input.height}</label>
                    <div className={styles.input_div}>
                      <input
                        className={styles.input}
                        type="number"
                        name="height"
                        value={formData.height || ''}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <p>cm</p>
                    </div>
                  </div>
                )}

                {input.depth && (
                  <div className={styles.form_div}>
                    <label className={styles.label}>{furnitureAssembly.form.input.depth}</label>
                    <div className={styles.input_div}>
                      <input
                        className={styles.input}
                        type="number"
                        name="depth"
                        value={formData.depth || ''}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <p>cm</p>
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
                    <label className={styles.label}>
                      {furnitureAssembly.form.input.wall.title}
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={formData.position === 'wall'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: e.target.checked ? 'wall' : 'floor',
                          }))
                        }
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                )}
                <div className={styles.textarea_div}>
                  <label className={styles.label}>Mas detalles</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    placeholder={furnitureAssembly.form.input.comment}
                    className={styles.textarea}
                  />
                </div>
              </div>
              <div className={styles.more_div}>
                {clientId && (
                  <ImageUploader
                    clientId={clientId}
                    category="furniture"
                    service="assembly"
                    requestId={requestId}
                    onImagesChange={handleImagesChange}
                  />
                )}
                <div className={styles.buttons_div}>
                  {request && (
                    <button
                      type="button"
                      className={styles.cancel_button}
                      onClick={() => setEdit?.(false)}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className={styles.submit_button}>
                    {request
                      ? furnitureAssembly.form.save_botton
                      : furnitureAssembly.form.submit_button}
                  </button>
                </div>
              </div>
            </form>
          </li>
        )}
      </ul>
    </section>
  );
};

export default FurnitureAssemblyForm;
