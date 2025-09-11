// import Hero from '../../../../../packages/components/pages/home/homeHero/HomeHero';
// import ServiceCart from '../../../../../packages/components/services/serviceCart/ServiceCart';
// import Reviews from '../../../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
// import BlogList from "../../../components/blog/blogList/page";

import styles from './page.module.css';
// import KitchenAssemblyForm from '../../../../../packages/components/services/kitchenAssembly/kitchenAssemblyForm/KitchenAssemblyForm';

const KitchenAssemblyPage = () => {
  const kitchenAssemblyHeader = {
    title: 'Kitchen Assembly Services in Berlin',
    description:
      'We assemble kitchens fully or partially. Complete the form to request a visit where we can evaluate and provide a final quote.',
    image: {
      src: '/svg/kitchen-assembly.svg',
      alt: 'Kitchen Assembly Illustration',
    },
    cta: '',
    href: '',
    extraClass: 'hero_services',
  };

  return (
    <main className={styles.main}>
      <header>{/* <Hero hero={kitchenAssemblyHeader} /> */}</header>
      <section className={styles.section}>
        {/* <KitchenAssemblyForm /> */}
        {/* <ServiceCart /> */}
      </section>
      {/* <Reviews /> */}
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
};

export default KitchenAssemblyPage;
