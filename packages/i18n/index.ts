import de_common from './de/common.json';
import de_popups from './de/popups.json';
import de_loadings from './de/loadings.json';
import de_pages from './de/pages.json';
import de_components from './de/components.json';

import en_common from './en/common.json';
import en_popups from './en/popups.json';
import en_loadings from './en/loadings.json';
import en_pages from './en/pages.json';
import en_components from './en/components.json';

import es_common from './es/common.json';
import es_popups from './es/popups.json';
import es_loadings from './es/loadings.json';
import es_pages from './es/pages.json';
import es_components from './es/components.json';

export const resources = {
  de: {
    ...de_common,
    popups: de_popups,
    loadings: de_loadings,
    pages: de_pages,
    components: de_components,
  },
  en: {
    ...en_common,
    popups: en_popups,
    loadings: en_loadings,
    pages: en_pages,
    components: en_components,
  },
  es: {
    ...es_common,
    popups: es_popups,
    loadings: es_loadings,
    pages: es_pages,
    components: es_components,
  },
};

export type Locale = keyof typeof resources;
export type Messages = typeof resources.de;
