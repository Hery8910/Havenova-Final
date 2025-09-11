import { jsx as _jsx } from "react/jsx-runtime";
import styles from './FinalCTA.module.css';
const FinalCTA = () => {
    // const finalCta: FinalCTAData | undefined = texts?.pages?.home?.hero;
    // if (!hero) {
    //   return (
    //     <section className={styles.section}>
    //       <div
    //         className={styles.skeleton}
    //         style={{ width: '100%', height: 504, background: '#eee' }}
    //       />
    //     </section>
    //   );
    // }
    return (_jsx("section", { className: styles.section, children: _jsx("main", { className: styles.main, children: _jsx("aside", { className: styles.aside, children: _jsx("p", { className: styles.p, children: "&" }) }) }) }));
};
export default FinalCTA;
