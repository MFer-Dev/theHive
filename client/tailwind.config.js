/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          blue: '#1877F2',
          dark: '#166fe5',
          gray: '#f0f2f5',
          text: '#050505',
          secondary: '#65676b'
        }
      }
    },
  },
  plugins: [],
}