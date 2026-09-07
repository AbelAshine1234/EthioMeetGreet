/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FAF7F2',
          surface: '#FFFFFF',
          card: '#FDFBF7',
          subtle: '#F4EFE6',
          border: '#EAE4D7',
          borderDark: '#D8D0C0',
          text: '#181818',
          muted: '#666666',
          yellow: '#FDE047',
          pastelPink: '#FCE7F3',
          pastelGreen: '#ECFDF5',
          pastelBlue: '#EFF6FF',
          pastelPurple: '#F5F3FF'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
