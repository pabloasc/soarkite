import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nanum Myeongjo', 'serif'],
        'serif': ['Nanum Myeongjo', 'serif'],
        'payfair': ['Nanum Myeongjo', 'serif'],
        'source-serif': ['Nanum Myeongjo', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;