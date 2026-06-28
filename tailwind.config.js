/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        squeeze: {
          ring:   '#8B5CF6',
          rest:   '#E5E7EB',
          glow:   '#C4B5FD',
          bg:     '#F9F7FF',
        },
      },
      fontFamily: {
        sans:   ['Inter-Regular', 'system-ui'],
        medium: ['Inter-Medium', 'system-ui'],
        bold:   ['Inter-Bold', 'system-ui'],
      },
    },
  },
  plugins: [],
};
