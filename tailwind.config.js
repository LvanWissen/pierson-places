import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {},

	plugins: [tailwindcssAnimate, typography]
};

export default config;
