import styles from './DirectoryFilters.module.css';

export type DirectorySelectOption = {
  value: string;
  label: string;
};

type DirectoryFiltersProps = {
  ariaLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectLabel: string;
  selectValue: string;
  selectOptions: DirectorySelectOption[];
  onSelectChange: (value: string) => void;
};

export function DirectoryFilters({
  ariaLabel,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  selectLabel,
  selectValue,
  selectOptions,
  onSelectChange,
}: DirectoryFiltersProps) {
  return (
    <section className={styles.root} aria-label={ariaLabel}>
      <label className={styles.field}>
        <span className={styles.label}>{searchLabel}</span>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{selectLabel}</span>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={selectValue}
            onChange={(event) => onSelectChange(event.target.value)}
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.selectIcon} aria-hidden="true" />
        </div>
      </label>
    </section>
  );
}
