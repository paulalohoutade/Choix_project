import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cec-blue':       '#1A3A5C',
        'cec-blue-mid':   '#234d78',
        'cec-blue-light': '#2d6099',
        'cec-gold':       '#C9A84C',
        'cec-gold-light': '#e2c97e',
        'cec-cream':      '#F5F0E8',
        'cec-dark':       '#0f2236',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Crimson Pro"', 'Georgia', 'serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        cec:  '0 2px 16px rgba(26,58,92,0.08)',
        gold: '0 4px 24px rgba(201,168,76,0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config
