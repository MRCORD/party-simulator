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
        // Primary colors
        primary: {
          DEFAULT: '#2563eb',  // blue-600
          light: '#dbeafe',    // blue-100
          dark: '#1e3a8a',     // blue-900
          secondary: '#3b82f6' // blue-500
        },
        
        // Accent colors
        accent: {
          teal: '#14b8a6',   // teal-500
          amber: '#f59e0b',  // amber-500
          pink: '#ec4899',   // pink-500
        },
        
        // Semantic colors
        success: {
          DEFAULT: '#10b981', // emerald-500
          light: '#d1fae5',   // emerald-100
          dark: '#065f46',    // emerald-800
        },
        warning: {
          DEFAULT: '#f59e0b',  // amber-500
          light: '#fef3c7',    // amber-100
          dark: '#92400e',     // amber-800
        },
        error: {
          DEFAULT: '#f43f5e',  // rose-500
          light: '#ffe4e6',    // rose-100
          dark: '#9f1239',     // rose-800
        },
        
        // Neutral colors kept as Tailwind defaults
      },
      
      // Custom box shadows
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        button: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Gradient backgrounds
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-primary-vertical': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
      
      // Animation
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
  ],
};