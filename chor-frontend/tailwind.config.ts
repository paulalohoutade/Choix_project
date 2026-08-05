import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cec-blue':       '#1A3A5C',
        'cec-blue-mid':   '#234d78',
        'cec-blue-light': '#2d6099',
        'cec-gold':       '#facc15',
        'cec-gold-light': '#fde047',
        'cec-cream':      '#F5F0E8',
        'cec-dark':       '#0f2236',
        'cec-anthracite': '#383838',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Crimson Pro"', 'Georgia', 'serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        cec:  '0 2px 16px rgba(26,58,92,0.08)',
        gold: '0 4px 24px rgba(250,204,21,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config
