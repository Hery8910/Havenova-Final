import React from 'react';
import sharedStyles from '../NavbarShared.module.css';

export interface NavbarPanelSectionProps {
  title: string;
  titleId: string;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  showHandle?: boolean;
  handleClassName?: string;
  children: React.ReactNode;
}

export function NavbarPanelSection({
  title,
  titleId,
  className,
  headerClassName,
  titleClassName,
  showHandle = false,
  handleClassName,
  children,
}: NavbarPanelSectionProps) {
  return (
    <section className={className} aria-labelledby={titleId}>
      {showHandle ? (
        <span
          className={`${sharedStyles.panelHandle} ${handleClassName ?? ''}`.trim()}
          aria-hidden="true"
        />
      ) : null}
      <div className={headerClassName}>
        <h2 id={titleId} className={`${sharedStyles.panelTitle} ${titleClassName ?? ''}`.trim()}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
