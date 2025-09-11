import Hero from '../../../../../packages/components/pages/home/homeHero/HomeHero';
import ServiceCart from '../../../../../packages/components/services/serviceCart/ServiceCart';
import Reviews from '../../../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';
// import BlogList from "../../../components/blog/blogList/page";

import styles from './page.module.css';
import HouseCleaningForm from '../../../../../packages/components/services/houseCleaning/houseCleaningForm/HouseCleaningForm';

const HouseCleaningPage = () => {
  // const blogs = [
  //   {
  //     id: "1",
  //     title:
  //       "How to Choose the Best Maintenance Service for Your Home and Avoid Scams",
  //     slug: "choose-best-maintenance-service",
  //     image: "/images/choose-best-maintenance-service-blog.webp",
  //     imageAlt: "Illustration of a professional worker in blue overalls",
  //     metaDescription:
  //       "Learn how to choose reliable home maintenance services and protect your home from scams.",
  //     introduction:
  //       "Did you know that 70% of home repairs could have been prevented with regular maintenance? This guide will help you select the right service and avoid common pitfalls.",
  //     sections: [
  //       {
  //         heading: "Key Factors to Consider",
  //         content: [
  //           {
  //             subheading: "Experience and Reviews",
  //             points: [
  //               "Check for companies with proven experience.",
  //               "Read reviews on trusted platforms.",
  //             ],
  //           },
  //           {
  //             subheading: "Transparent Pricing",
  //             paragraph:
  //               "Always request detailed written estimates before agreeing to any service.",
  //           },
  //         ],
  //       },
  //       {
  //         heading: "Common Mistakes to Avoid",
  //         content: [
  //           {
  //             subheading: "Choosing the cheapest option",
  //             paragraph:
  //               "Low prices can mean poor quality work or hidden costs.",
  //           },
  //         ],
  //       },
  //     ],
  //     faq: [
  //       {
  //         question: "How often should I schedule maintenance?",
  //         answer:
  //           "Most experts recommend at least once a year for general inspections.",
  //       },
  //     ],
  //     createdAt: "2024-03-01T10:00:00Z",
  //     author: "Havenova Team",
  //   },
  //   {
  //     id: "2",
  //     title: "The Ultimate Home Maintenance Checklist for Every Season",
  //     slug: "home-maintenance-checklist",
  //     image: "/images/home-maintenance-checklist-blog.webp",
  //     imageAlt: "Illustration of a man booking appointments on a calendar",
  //     metaDescription:
  //       "Keep your home in top condition all year round with this seasonal maintenance checklist.",
  //     introduction:
  //       "Your home needs care in every season. This checklist will guide you through simple yet essential tasks to protect your home and prevent costly repairs.",
  //     sections: [
  //       {
  //         heading: "Spring Maintenance Tasks",
  //         content: [
  //           {
  //             subheading: "Check Roof and Gutters",
  //             points: ["Inspect for winter damage.", "Clean out all debris."],
  //           },
  //           {
  //             subheading: "Garden and Outdoor Prep",
  //             points: ["Prune shrubs and trees.", "Clean outdoor furniture."],
  //           },
  //         ],
  //       },
  //       {
  //         heading: "Summer Maintenance Tasks",
  //         content: [
  //           {
  //             subheading: "HVAC Inspection",
  //             paragraph:
  //               "Ensure your air conditioning system is working efficiently before the heat peaks.",
  //           },
  //           {
  //             subheading: "Window and Door Seals",
  //             points: [
  //               "Check for gaps or leaks.",
  //               "Replace damaged seals to improve energy efficiency.",
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //     faq: [
  //       {
  //         question: "Do I need a professional inspection every season?",
  //         answer:
  //           "Not necessarily. Many tasks can be done by homeowners, but a yearly professional inspection is highly recommended.",
  //       },
  //     ],
  //     createdAt: "2024-03-10T12:30:00Z",
  //     author: "Havenova Team",
  //   },
  //   {
  //     id: "3",
  //     title: "How to Prepare Your Home for Winter",
  //     slug: "prepare-home-for-winter",
  //     image: "/images/prepare-home-for-winter-blog.webp",
  //     imageAlt:
  //       "Illustration of a girl sitting on the windowsill drinking a winter drink and wrapped in a blanket Winter background outside the window.",
  //     metaDescription:
  //       "Learn the essential steps to prepare your home for winter and avoid costly seasonal damages.",
  //     introduction:
  //       "Winter can be tough on homes. This guide will help you protect your property and stay comfortable during the cold months.",
  //     sections: [
  //       {
  //         heading: "1. Check Heating Systems",
  //         content: [
  //           {
  //             paragraph:
  //               "Ensure your heating system is serviced and working efficiently before the cold hits.",
  //           },
  //         ],
  //       },
  //       {
  //         heading: "2. Seal Windows and Doors",
  //         content: [
  //           {
  //             paragraph:
  //               "Prevent drafts and save on energy bills by sealing gaps and replacing weather stripping.",
  //           },
  //         ],
  //       },
  //     ],
  //     faq: [
  //       {
  //         question: "When should I schedule heating system maintenance?",
  //         answer: "At the start of autumn is the best time.",
  //       },
  //     ],
  //     createdAt: "2024-03-10T12:30:00Z",
  //     author: "Havenova Team",
  //   },
  //   {
  //     id: "4",
  //     title: "Signs You Need to Renovate Your Kitchen",
  //     slug: "kitchen-renovation-signs",
  //     image: "/images/kitchen-renovation-signs-blog.webp",
  //     imageAlt: "Illustration of a professional worker renovating a kitchen",
  //     metaDescription:
  //       "Is it time for a kitchen renovation? Learn the key signs that your kitchen needs a makeover.",
  //     introduction:
  //       "The kitchen is the heart of the home. Here’s how to tell when it’s time to renovate and improve your kitchen space.",
  //     sections: [
  //       {
  //         heading: "1. Outdated Design",
  //         content: [
  //           {
  //             paragraph:
  //               "Old cabinets, worn countertops, and outdated appliances are clear signals you need a refresh.",
  //           },
  //         ],
  //       },
  //       {
  //         heading: "2. Lack of Storage",
  //         content: [
  //           {
  //             paragraph:
  //               "If you’re constantly running out of space, it's time to rethink your kitchen layout.",
  //           },
  //         ],
  //       },
  //     ],
  //     faq: [
  //       {
  //         question: "How often should a kitchen be renovated?",
  //         answer: "Every 10-15 years or when it no longer suits your needs.",
  //       },
  //     ],
  //     createdAt: "2024-03-10T12:30:00Z",
  //     author: "Havenova Team",
  //   },
  //   {
  //     id: "5",
  //     title: "The Benefits of Scheduling Regular Home Inspections",
  //     slug: "benefits-regular-home-inspections",
  //     image: "/images/benefits-regular-home-inspections-blog.webp",
  //     imageAlt: "Illustration of a person checking a list",
  //     metaDescription:
  //       "Find out why regular home inspections are key to maintaining your property’s value and safety.",
  //     introduction:
  //       "Home inspections aren’t just for buying or selling. Learn how regular checks can protect your home and save you money.",
  //     sections: [
  //       {
  //         heading: "1. Early Problem Detection",
  //         content: [
  //           {
  //             paragraph:
  //               "Catching small issues before they become big repairs can save you thousands.",
  //           },
  //         ],
  //       },
  //       {
  //         heading: "2. Peace of Mind",
  //         content: [
  //           {
  //             paragraph:
  //               "Knowing your home is in good condition brings comfort and security.",
  //           },
  //         ],
  //       },
  //     ],
  //     faq: [
  //       {
  //         question: "How often should I schedule a home inspection?",
  //         answer: "Every 2-3 years or before undertaking major renovations.",
  //       },
  //     ],
  //     createdAt: "2024-03-10T12:30:00Z",
  //     author: "Havenova Team",
  //   },
  // ];

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
        <HouseCleaningForm />
        <ServiceCart />
      </section>
      <Reviews />
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
};

export default HouseCleaningPage;
