import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// src/components/Testimonials.tsx
import Link from 'next/link';
import ReviewStars from '../../../client/testimonials/reviewStars/ReviewStars';
import styles from './Testimonials.module.css';
const Testimonials = ({ title, subtitle, description, items, cta, mobile }) => {
  const num = mobile ? 4 : 6;
  return _jsxs('section', {
    className: styles.section1,
    'aria-labelledby': 'testimonials-title',
    children: [
      _jsxs('header', {
        children: [
          _jsx('h2', { id: 'testimonials-title', children: title }),
          _jsx('h3', { className: styles.h3, id: 'testimonials-subtitle', children: subtitle }),
        ],
      }),
      _jsx('ul', {
        className: styles.ul,
        children: items
          .slice(0, num)
          .map((item) =>
            _jsxs(
              'li',
              {
                className: `${styles.li} card`,
                children: [
                  _jsxs('header', {
                    className: styles.header_li,
                    'aria-label': `Rezension von ${item.author}`,
                    children: [
                      _jsxs('div', {
                        className: styles.name_div,
                        children: [
                          _jsxs('time', {
                            className: styles.section,
                            dateTime: new Date(item.date).toISOString(),
                            children: ['Bewertet am ', new Date(item.date).toLocaleDateString()],
                          }),
                          _jsx('h4', { className: styles.section, children: item.author }),
                        ],
                      }),
                      _jsxs('div', {
                        className: styles.rating_div,
                        children: [
                          _jsx(ReviewStars, { rating: item.rating }),
                          _jsxs('p', { className: styles.section, children: [item.rating, '/5'] }),
                        ],
                      }),
                    ],
                  }),
                  _jsx('p', { className: styles.section, children: item.text }),
                  item.reply &&
                    _jsxs('footer', {
                      className: styles.section,
                      children: [
                        _jsx('p', { className: styles.section, children: 'Antwort' }),
                        _jsx('p', { className: styles.section, children: item.reply.text }),
                      ],
                    }),
                ],
              },
              item.id
            )
          ),
      }),
      _jsxs('aside', {
        className: styles.section,
        children: [
          _jsx('p', { className: styles.section, children: description }),
          _jsx(Link, {
            href: cta.href,
            className: 'button',
            'aria-label': `${cta.label} – gehe zu ${cta.href}`,
            children: cta.label,
          }),
        ],
      }),
    ],
  });
};
export default Testimonials;
