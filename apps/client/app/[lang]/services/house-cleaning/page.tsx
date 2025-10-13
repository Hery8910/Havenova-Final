import Hero from '../../../../../../packages/components/pages/homeHero/HomeHero';
// import ServiceCart from '../../../../../packages/components/services/serviceCart/ServiceCart';
import Reviews from '../../../../../../packages/components/common/reviews/reviewsSection/ReviewsSection';
// import BlogList from "../../../components/blog/blogList/page";

import styles from './page.module.css';
// import HouseCleaningForm from '../../../../../packages/components/services/houseCleaning/houseCleaningForm/HouseCleaningForm';

const HouseCleaningPage = () => {
  const houseCleaningHeader = {
    title: 'House Cleaning Services in Berlin',
    description:
      'Tell us what kind of cleaning you need. We’ll visit to evaluate your space before offering a price.',
    image: {
      src: '/svg/house-cleaning.svg',
      alt: 'Home Cleaning Illustration',
    },
    cta: '',
    href: '',
    extraClass: 'hero_services',
  };
  return (
    <main className={styles.main}>
      {/* <Hero hero={houseCleaningHeader} /> */}
      <section className={styles.section}>
        {/* <HouseCleaningForm /> */}
        {/* <ServiceCart /> */}
      </section>
      {/* <Reviews /> */}
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
};

export default HouseCleaningPage;
