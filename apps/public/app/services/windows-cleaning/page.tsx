// import Reviews from '../../../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
// import BlogList from "../../../components/blog/blogList/page";

import styles from './page.module.css';
// import ServiceCart from '../../../../../packages/components/services/serviceCart/ServiceCart';
// import WindowsCleaningForm from '../../../../../packages/components/services/windowsCleaning/windowsCleaningForm/WindowsCleaningForm';

const WindowsCleaningPage = () => {
  const windowsCleaningHeader = {
    title: 'Window Cleaning Services in Berlin',
    description:
      "Book a streak-free window cleaning service. Fill out the form and we'll arrange a visit to assess your needs before confirming pricing.",
    image: {
      src: '/svg/windows-cleaning.svg',
      alt: 'Window Cleaning Illustration',
    },
    cta: '',
    href: '',
    extraClass: 'hero_services',
  };
  return (
    <main className={styles.main}>
      <header>{/* <Hero hero={windowsCleaningHeader} /> */}</header>
      <section className={styles.section}>
        {/* <WindowsCleaningForm /> */}
        {/* <ServiceCart /> */}
      </section>
      {/* <Reviews /> */}
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
};

export default WindowsCleaningPage;
