/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          900: '#3B0A0A',
          700: '#5A1212',
        },
        brand: {
          red: '#8B0000',
        },
        gold: {
          500: '#C9A24B',
          300: '#E0C481',
        },
        ivory: {
          100: '#F4EBD0',
        },
        ink: {
          900: '#0A0606',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      maxWidth: {
        site: '1280px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
