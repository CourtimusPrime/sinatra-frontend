// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
      },
      fontFamily: {
        theme: ['var(--font)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};