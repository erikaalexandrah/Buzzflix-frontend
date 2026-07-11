const { default: daisyui } = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
      },
      colors: {
        paper: '#F3EEE3',   // fondo hueso
        ink: '#111111',     // negro tinta
        buzz: '#FFE500',    // amarillo eléctrico (marca)
        grape: '#6C4CFF',   // violeta eléctrico
        coral: '#FF5A36',   // coral / naranja
        electric: '#2D6BFF',// azul
        bubble: '#FF7AC6',  // rosa
      },
      boxShadow: {
        brutal: '6px 6px 0 0 #111111',
        'brutal-sm': '3px 3px 0 0 #111111',
        'brutal-lg': '10px 10px 0 0 #111111',
        'brutal-white': '6px 6px 0 0 #F3EEE3',
      },
    },
  },
  plugins: [require('daisyui')],
}
