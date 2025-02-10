module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'card-background': 'var(--card-background)',
        'card-border': 'var(--card-border)',
      },
      fontFamily: {
        barlow: ['var(--font-barlow-semi)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 