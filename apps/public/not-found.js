"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className={styles.not_found}>
      <Image
        className={styles.not_found_image}
        src="/svg/not-found.svg"
        priority={true}
        alt="Abbildung des Fehlers 404, Seite nicht gefunden"
        width={250}
        height={250}
      />
      <h1>Es scheint, als hättest du dich selbst verloren...</h1>
      <p>Die gesuchte Seite existiert nicht oder wurde entfernt.</p>
      <Link className='button' href="/">Homepage</Link>
    </section>
  );
}
