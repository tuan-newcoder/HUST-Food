/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E11D48',     // Đỏ ấm (rose-600)
          secondary: '#F59E0B',   // Vàng cam (amber-500)
          dark: '#0F172A',        // Slate 900
          muted: '#64748B',       // Slate 500
          border: '#E2E8F0',      // Slate 200
          bg: '#F8FAFC',          // Slate 50
          surface: '#FFFFFF',     // White
        }
      }
    },
  },
  plugins: [],
}
