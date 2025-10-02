declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production"
			ENCRYPTION_KEY: string
			HMAC_KEY: string
			ACCESS_TOKEN_SECRET: string
			REFRESH_TOKEN_SECRET: string
			TEMPORARY_TOKEN_SECRET: string
			GLOBAL_DATABASE_URL: string
			INSTANCE_DATABASE_URL: string
			MINIO_URL: string
			MINIO_PORT?: string
			MINIO_USE_SSL: string
			MINIO_ACCESS_KEY: string
			MINIO_SECRET_KEY: string
			MINIO_REGION: string
		}
	}
}

export {}