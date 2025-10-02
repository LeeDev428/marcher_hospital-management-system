import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",

	modules: [
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@pinia/nuxt",
		"pinia-plugin-persistedstate/nuxt",
		"shadcn-nuxt",
	],

	css: ["@/assets/css/global.css"],

	vite: {
		plugins: [tailwindcss()],
	},

	components: [
		"@/components",
		{
			path: "@/pages",
			pattern: "**/components/**",
			pathPrefix: false,
		},
	],

	pages: {
		pattern: ["**/*.vue", "!**/components/**"],
	},

	build: {
		transpile: ["trpc-nuxt"],
	},

	devtools: {
		enabled: true,
		timeline: {
			enabled: true,
		},
	},
})
