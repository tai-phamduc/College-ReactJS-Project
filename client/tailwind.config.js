/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6000',
        secondary: '#1a1a1a',
        dark: '#0f0f0f',
        light: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
