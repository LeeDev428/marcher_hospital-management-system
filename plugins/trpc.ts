import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client"
import type { AppRouter } from "@/server/trpc/routers"

export default defineNuxtPlugin(() => {
	// Get the base URL - use absolute URL for SSR, relative for client
	const getBaseUrl = () => {
		if (process.server) {
			// Server-side: use the full URL
			return 'http://localhost:3000'
		}
		// Client-side: use relative URL
		return ''
	}

	const trpc = createTRPCNuxtClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include', // Include cookies in requests
					})
				},
			}),
		],
	})

	return {
		provide: {
			trpc,
		},
	}
})