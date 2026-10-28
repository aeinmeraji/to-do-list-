/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f5f7',
        ink: '#202124',
        muted: '#6f737a',
        line: '#e3e5e8',
        accent: '#5b67d6',
      },
      boxShadow: {
        panel: '0 18px 50px rgba(30, 35, 45, 0.08)',
      },
    },
  },
  plugins: [],
}
