/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6000',
        'primary-hover': '#e05600',
        secondary: '#1a1a1a',
        dark: '#0f0f0f',
        'light-gray': '#2a2a2a',
        white: '#ffffff',
        'muted': '#9ca3af',
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
      },
      spacing: {
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      height: {
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [],
}
