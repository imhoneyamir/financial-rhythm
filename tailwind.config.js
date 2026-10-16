/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        canvas: '#D8D3CD',
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5F0E4',
          300: '#EFE8D6',
        },
        slate: {
          950: '#111111',
          900: '#161616',
          800: '#222222',
          600: '#525252',
          500: '#737373',
          400: '#A3A3A3',
        }
      },
      boxShadow: {
        'phone': '0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 24px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.03)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'fab': '0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2.25rem',
        '5xl': '2.75rem',
      }
    },
  },
  plugins: [],
}
