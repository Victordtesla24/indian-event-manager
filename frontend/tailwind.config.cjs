/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blood-red': '#880808',
        'indian-maroon': '#800000',
        'indian-saffron': '#FF9933',
        'peacock-lime': '#D4F04F',
        'peacock-teal': '#00A693',
        'peacock-blue': '#0077BE',
        'peacock-indigo': '#4B3B8C',
        'peacock-purple': '#3C1361',
        'peacock-lime-light': '#E8F7A1',
        'peacock-teal-light': '#B3E6DE',
        'peacock-blue-light': '#B3D9FF',
        'peacock-indigo-light': '#C5BEE6',
        'peacock-purple-light': '#C4B3D4',
        'lotus-white': '#FFF5F5',
        'off-white': '#FAF9F6',
      },
      backgroundImage: theme => ({
        'peacock-gradient': `
          linear-gradient(
            135deg,
            var(--tw-gradient-from) 0%,
            var(--tw-gradient-to) 100%
          )
        `,
        'geometric-pattern': `
          repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(255, 255, 255, 0.95) 0deg,
            rgba(255, 255, 255, 0.5) 0.5deg,
            rgba(255, 255, 255, 0.95) 1deg,
            rgba(255, 255, 255, 0.5) 1.5deg,
            rgba(255, 255, 255, 0.95) 2deg
          ),
          repeating-conic-gradient(
            from 60deg at 50% 50%,
            rgba(255, 255, 255, 0.9) 0deg,
            rgba(255, 255, 255, 0.4) 0.5deg,
            rgba(255, 255, 255, 0.9) 1deg,
            rgba(255, 255, 255, 0.4) 1.5deg,
            rgba(255, 255, 255, 0.9) 2deg
          ),
          repeating-conic-gradient(
            from 120deg at 50% 50%,
            rgba(255, 255, 255, 0.85) 0deg,
            rgba(255, 255, 255, 0.3) 0.5deg,
            rgba(255, 255, 255, 0.85) 1deg,
            rgba(255, 255, 255, 0.3) 1.5deg,
            rgba(255, 255, 255, 0.85) 2deg
          ),
          linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.4)
          )
        `,
        'peacock-feather': `
          radial-gradient(
            circle at center,
            rgba(0, 119, 190, 0.5) 0%,
            rgba(0, 166, 147, 0.5) 20%,
            rgba(212, 240, 79, 0.4) 40%,
            transparent 60%
          ),
          conic-gradient(
            from 0deg at center,
            rgba(255, 255, 255, 0.9) 0deg,
            rgba(255, 255, 255, 0.5) 90deg,
            rgba(255, 255, 255, 0.9) 180deg,
            rgba(255, 255, 255, 0.5) 270deg,
            rgba(255, 255, 255, 0.9) 360deg
          ),
          repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.4) 10px,
            rgba(255, 255, 255, 0.5) 10px,
            rgba(255, 255, 255, 0.5) 20px
          )
        `,
        'feather-eye': `
          radial-gradient(
            circle at center,
            rgba(0, 119, 190, 0.6) 0%,
            rgba(0, 166, 147, 0.6) 30%,
            rgba(212, 240, 79, 0.5) 50%,
            transparent 70%
          ),
          conic-gradient(
            from 0deg at center,
            rgba(255, 255, 255, 0.95) 0deg,
            rgba(255, 255, 255, 0.6) 90deg,
            rgba(255, 255, 255, 0.95) 180deg,
            rgba(255, 255, 255, 0.6) 270deg,
            rgba(255, 255, 255, 0.95) 360deg
          )
        `,
      }),
      boxShadow: {
        'emboss': 'inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        lotus: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        shimmer: 'shimmer 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        lotus: 'lotus 4s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        },
      };
      addUtilities(newUtilities, ['hover', 'responsive']);
    }
  ],
}
