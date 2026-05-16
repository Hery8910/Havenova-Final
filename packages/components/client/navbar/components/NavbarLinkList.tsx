import Image from 'next/image';
import sharedStyles from '../NavbarShared.module.css';
import styles from './NavbarLinkList.module.css';
import type { NavLinkItem } from '../navbar.types';

export interface NavbarLinkListProps {
  items: NavLinkItem[];
  onItemClick: (href: string) => void;
  variant?: 'inline' | 'panel';
  animated?: boolean;
  animationDirection?: 'up' | 'down';
  hideIcons?: boolean;
}

export function NavbarLinkList({
  items,
  onItemClick,
  variant = 'panel',
  animated = false,
  animationDirection = 'up',
  hideIcons = false,
}: NavbarLinkListProps) {
  const isInline = variant === 'inline';
  const animatedClassName =
    animationDirection === 'down' ? sharedStyles.panelListAnimatedDown : sharedStyles.panelListAnimated;
  const listClassName = isInline
    ? styles.inlineList
    : `${sharedStyles.panelList} ${animated ? animatedClassName : ''} ${styles.panelList}`.trim();
  const itemClassName = isInline ? styles.inlineItem : styles.panelItem;
  const buttonClassName = isInline
    ? `button button--ghost ${styles.inlineButton}`
    : `button button--ghost ${styles.panelButton}`;

  return (
    <ul className={listClassName}>
      {items.map((item) => {
        const Icon = item.icon;
        const imageSrc = item.image ?? item.img;

        return (
          <li key={item.href} className={itemClassName}>
            <button type="button" className={buttonClassName} onClick={() => onItemClick(item.href)}>
              {imageSrc ? (
                <Image className={styles.panelImage} src={imageSrc} alt="" width={24} height={24} />
              ) : Icon && !hideIcons ? (
                <span className={styles.panelIcon}>
                  <Icon aria-hidden />
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
