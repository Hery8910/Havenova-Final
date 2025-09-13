import de from './de.json' with { type: "json" };
import en from './en.json' with { type: "json" };

export const resources = { de, en } as const; // 👈 as const = claves literales

export type Locale = keyof typeof resources; // "de" | "en"
export type Messages = (typeof resources)[Locale];