// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx}',        // App Router files
    './components/**/*.{js,jsx}', // Components folder
  ],
  theme: {
    extend: {
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        scaleIn: 'scaleIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
