/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8F7',
        card: '#FFFFFF',
        ink: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
        border: {
          subtle: '#E2E8F0',
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
        teal: {
          brand: '#0F5C54',
          hover: '#0B4741',
          light: '#E6F4F2',
        },
        certainty: {
          verifiedBg: '#ECFDF5',
          verifiedText: '#065F46',
          calcBg: '#EFF6FF',
          calcText: '#1E40AF',
          estBg: '#F3F4F6',
          estText: '#374151',
          needBg: '#FFFBEB',
          needText: '#92400E',
        },
        delta: {
          decrease: '#15803D',
          increase: '#B45309',
          residual: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      transitionTimingFunction: {
        banking: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '220ms',
      }
    },
  },
  plugins: [],
}
