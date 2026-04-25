import Link from 'next/link';
import Image from 'next/image';

export interface NavbarBrandProps {
  href?: string;
  ariaLabel: string;
  logoAlt: string;
  logoSrc: string;
  width: number;
  height: number;
  priority?: boolean;
  linkClassName?: string;
  imageClassName?: string;
}

export function NavbarBrand({
  href = '/',
  ariaLabel,
  logoAlt,
  logoSrc,
  width,
  height,
  priority = true,
  linkClassName,
  imageClassName,
}: NavbarBrandProps) {
  return (
    <Link className={linkClassName} href={href} aria-label={ariaLabel}>
      <Image
        className={imageClassName}
        src={logoSrc}
        alt={logoAlt}
        width={width}
        height={height}
        priority={priority}
      />
    </Link>
  );
}
