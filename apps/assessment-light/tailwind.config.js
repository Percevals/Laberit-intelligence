/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dii-primary': '#2c3e50',
        'dii-secondary': '#3498db',
        'dii-danger': '#e74c3c',
        'dii-warning': '#f39c12',
        'dii-success': '#2ecc71',
        'dii-info': '#3498db',
      }
    },
  },
  plugins: [],
}