import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// SAINT Website Standardized Colors
				saint: {
					title: '#000000',        // Title text
					body: '#333333',         // Subtitle/Body text
					bg: '#FFFFFF',          // Background
					bgSecondary: '#F5F5F5', // Secondary background
					primary: '#3A85C9',     // Primary button
					btnText: '#FFFFFF',     // Button text
					accent: '#E3C23E',      // Accent color
					footer: '#7D7D7D',      // Footer text
					border: '#CCCCCC'       // Border color
				},
				// Keep essential shadcn colors for compatibility
				border: '#CCCCCC',
				input: '#CCCCCC',
				ring: '#3A85C9',
				background: '#FFFFFF',
				foreground: '#000000',
				primary: {
					DEFAULT: '#3A85C9',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#F5F5F5',
					foreground: '#333333'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5F5F5',
					foreground: '#7D7D7D'
				},
				accent: {
					DEFAULT: '#E3C23E',
					foreground: '#000000'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
