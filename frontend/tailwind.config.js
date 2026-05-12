/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          900: '#0a0e27',
          950: '#050711',
        },
        neon: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          pink: '#ec4899',
          amber: '#f59e0b',
          lime: '#84cc16',
          rose: '#f43f5e',
          blue: '#0ea5e9',
          indigo: '#6366f1',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f0a2e 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
        'gradient-cyan-pink': 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-blue-cyan': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        'gradient-lime-cyan': 'linear-gradient(135deg, #84cc16 0%, #06b6d4 100%)',
        'gradient-rose-purple': 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)',
        'gradient-indigo-purple': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glow-lime': '0 0 20px rgba(132, 204, 22, 0.3)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.3)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'neon-cyan': '0 0 30px rgba(6, 182, 212, 0.5)',
        'neon-purple': '0 0 30px rgba(168, 85, 247, 0.5)',
        'neon-pink': '0 0 30px rgba(236, 72, 153, 0.5)',
      },
    },
  },
  plugins: [],
}
