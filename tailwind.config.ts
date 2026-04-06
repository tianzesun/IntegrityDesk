import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg0: 'var(--bg0)',
        bg1: 'var(--bg1)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        t0: 'var(--t0)',
        t1: 'var(--t1)',
        t2: 'var(--t2)',
        bd: 'var(--bd)',
        bd2: 'var(--bd2)',
        gold: 'var(--gold)',
        gold2: 'var(--gold2)',
        'gold-g': 'var(--gold-g)',
        teal: 'var(--teal)',
        teal2: 'var(--teal2)',
        'teal-g': 'var(--teal-g)',
        red: 'var(--red)',
        amber: 'var(--amber)',
      },
      fontFamily: {
        display: ['var(--font-bricolage)'],
        body: ['var(--font-outfit)'],
      },
      animation: {
        'fade-slide-down': 'fadeSlideDown 0.8s ease both',
        'fade-up': 'fadeUp 0.9s ease both',
      },
      keyframes: {
        fadeSlideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

export default config