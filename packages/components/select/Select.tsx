import { useState } from 'react';
import styles from './Select.module.css';
import { IoIosArrowBack } from 'react-icons/io';
import Image from 'next/image';

// Opción individual
interface SelectOption {
  name: string;
  icon?: {
    src: string;
    alt: string;
  };
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, options, onChange, multiple = true }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (name: string) => {
    let updated: string[];

    if (multiple) {
      updated = selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name];
    } else {
      updated = [name];
      setOpen(false);
    }

    setSelected(updated);
    onChange(updated);
    console.log(updated);
  };

  return (
    <section className={styles.section}>
      <header onClick={handleToggle} className={styles.header}>
        <h4 className={styles.h4}>{label}</h4>
        <IoIosArrowBack className={`${styles.icon} ${open ? styles.open : ''}`} />
      </header>
      {selected.length > 0 && (
        <ul className={styles.selected_ul}>
          <p className={styles.selected_p}>
            <strong>{label} :</strong>
          </p>
          {selected.map((name, index) => (
            <li className={styles.selected_li} key={name}>
              {name}
              {selected.length > 1 && selected.length - 1 !== index && ','}
            </li>
          ))}
        </ul>
      )}
      {open && (
        <ul className={styles.ul}>
          {options.map((option) => (
            <li
              key={option.name}
              className={`${styles.li} ${selected.includes(option.name) ? styles.selected : ''}`}
              onClick={() => handleSelect(option.name)}
            >
              {option.icon && (
                <Image
                  className={styles.image}
                  src={option.icon.src}
                  alt={option.icon.alt}
                  width={50}
                  height={50}
                />
              )}
              <p>{option.name}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Select;
