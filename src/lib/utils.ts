import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's own scales. The font sizes in this project are custom
 * `--text-*` tokens, so the default config could not tell `text-micro` from a text COLOUR, filed it
 * in the colour group, and dropped it as soon as a real colour followed in the same merge.
 * `button.tsx` merges "text-micro ... text-ink": the size lost, and every button on the site
 * rendered at the inherited 16px instead of its token. Teaching the merger the scale fixes it at
 * the root, so any future `text-<token>` beside a colour survives too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "label", "quote", "hero", "section", "display"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
