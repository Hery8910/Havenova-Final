'use client';
import React, { useState } from 'react';
import styles from './Info.module.css';

import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface InfoProps {
  direction?: string;
  info: {
    question: string;
    answer: string;
  };
  image?: {
    url: string;
    alt: string;
  };
}

const Info: React.FC<InfoProps> = ({ direction, info, image }) => {
  const [open, setOpen] = useState<boolean>(false);

  if (!info) return null;

  return (
    <main className={styles.main}>
      <button className={styles.open} onClick={() => setOpen((pre) => !pre)}>
        <AiOutlineQuestionCircle />
      </button>
      {open && (
        <article className={`${styles.article} ${styles[`${direction}`]}`}>
          <div className={styles.div}>
            <p>{info.question}</p>
            <button className={styles.close} onClick={() => setOpen(false)}>
              <IoClose />
            </button>
          </div>
          <p>{info.answer}</p>
          {image && (
            <Image
              className={styles.image}
              src={image.url}
              priority={true}
              alt={image.alt}
              width={600}
              height={200}
            />
          )}
        </article>
      )}
    </main>
  );
};

export default Info;
