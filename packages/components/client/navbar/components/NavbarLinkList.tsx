import Image from 'next/image';
import type { NavLinkItem } from '../navbar.types';

export interface NavbarLinkListProps {
  items: NavLinkItem[];
  onItemClick: (href: string) => void;
  listClassName?: string;
  itemClassName?: string;
  buttonClassName: string;
  iconClassName?: string;
  imageClassName?: string;
  hideIcons?: boolean;
}

export function NavbarLinkList({
  items,
  onItemClick,
  listClassName,
  itemClassName,
  buttonClassName,
  iconClassName,
  imageClassName,
  hideIcons = false,
}: NavbarLinkListProps) {
  return (
    <ul className={listClassName}>
      {items.map((item) => {
        const Icon = item.icon;
        const imageSrc = item.image ?? item.img;

        return (
          <li key={item.href} className={itemClassName}>
            <button
              type="button"
              className={buttonClassName}
              onClick={() => onItemClick(item.href)}
            >
              {imageSrc ? (
                <Image
                  className={imageClassName}
                  src={imageSrc}
                  alt=""
                  width={24}
                  height={24}
                />
              ) : Icon && !hideIcons ? (
                <span className={iconClassName}>
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
