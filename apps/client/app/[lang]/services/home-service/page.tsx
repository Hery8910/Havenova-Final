// import Hero from '../../../../../packages/components/pages/home/homeHero/HomeHero';
// import Reviews from '../../../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
// import BlogList from "../../../components/blog/blogList/page";

import styles from './page.module.css';

const HomeServicePage = () => {
  const homeServiceHeader = {
    title: 'Home Service & Maintenance in Berlin',
    description:
      'Describe the issue or service needed. We’ll review your request and schedule a visit to determine the scope and pricing.',
    image: {
      src: '/svg/home-service.svg',
      alt: 'Home Repair Illustration',
    },
    cta: '',
    href: '',
    extraClass: 'hero_services',
  };
  return (
    <main className={styles.main}>
      {/* <Hero hero={homeServiceHeader} /> */}
      <section className={styles.section}>
        {/* <HouseServiceForm /> */}
        {/* <ServiceCart /> */}
      </section>
      {/* <Reviews /> */}
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
};

export default HomeServicePage;
