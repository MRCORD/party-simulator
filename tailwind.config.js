/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors - softer blues
        primary: {
          DEFAULT: '#4f86f7',  // Softer blue
          light: '#e0ecff',    // Lighter blue
          dark: '#2c5282',     // Less intense dark blue
          secondary: '#63b3ed' // Softer blue-500
        },
        
        // Accent colors - softer tones
        accent: {
          teal: '#4fd1c5',   // Softer teal
          amber: '#f6ad55',  // Softer amber
          pink: '#ed64a6',   // Softer pink
        },
        
        // Semantic colors - less intense
        success: {
          DEFAULT: '#68d391', // Softer green
          light: '#e6fffa',   // Light teal background
          dark: '#2f855a',    // Softer dark green
        },
        warning: {
          DEFAULT: '#f6ad55',  // Softer amber
          light: '#fffaf0',    // Softer amber background
          dark: '#c05621',     // Softer dark amber
        },
        error: {
          DEFAULT: '#fc8181',  // Softer red
          light: '#fff5f5',    // Softer red background
          dark: '#c53030',     // Softer dark red
        },
        
        // Neutral colors kept as Tailwind defaults
      },
      
      // Custom box shadows - softer
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        button: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Gradient backgrounds
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--color-primary-blue), var(--color-primary-secondary))',
        'gradient-success': 'linear-gradient(to right, var(--color-accent-teal), var(--color-success))',
        'gradient-warning': 'linear-gradient(to right, var(--color-warning), var(--color-accent-amber))',
        'gradient-error': 'linear-gradient(to right, var(--color-error), var(--color-accent-pink))',
      },
      
      // Animation
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'scaleIn': 'scaleIn 0.4s ease-out forwards',
        'slideInRight': 'slideInRight 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
  ],
};