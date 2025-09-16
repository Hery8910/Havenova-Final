'use client';
import { useState } from 'react';
import FAQPreview from './FAQPreview';
import FAQPreviewSkeleton from './FAQPreview.skeleton';
import { ButtonProps } from '../button/Button';

export interface FAQPreviewItems {
  question: string;
  answer: string;
}
export interface CTAItem {
  title: string;
  description: string;
}

export interface FAQPreviewWrapperProps {
  title: string;
  items: FAQPreviewItems[];
  cta: CTAItem;
  button: ButtonProps;
  image: string;
  onClick: () => void;
}

const FAQPreviewWrapper: React.FC<FAQPreviewWrapperProps> = ({
  title,
  items,
  cta,
  button,
  onClick,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!title || !items) {
    return <FAQPreviewSkeleton />;
  }

  return (
    <FAQPreview
      title={title}
      items={items}
      cta={cta}
      button={button}
      onClick={onClick}
      openIndex={openIndex}
      onToggle={handleToggle}
    />
  );
};

export default FAQPreviewWrapper;
