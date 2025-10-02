import { Client as MinioClient } from "minio"
import type { File } from "@/types/app/file"

const minioClient = new MinioClient({
	endPoint: process.env.MINIO_URL,
	port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : undefined,
	useSSL: process.env.MINIO_USE_SSL === "true",
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretKey: process.env.MINIO_SECRET_KEY,
})

export const getBuckets = async () => {
	try {
		const buckets = await minioClient.listBuckets()
		return buckets
	} catch (error) {
		console.error(error)
		return []
	}
}

export const createBucket = async (bucketName: string) => {
	try {
		await minioClient.makeBucket(bucketName, process.env.MINIO_REGION)

		return {
			success: true,
			message: "Bucket created successfully",
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "Failed to create bucket",
		}
	}
}

export const uploadFile = async (bucketName: string, file: File) => {
	try {
		const buckets = await getBuckets()

		if (!buckets.some(bucket => bucket.name === "files")) {
			const { success, message } = await createBucket("files")
			if (!success) {
				console.error(message)
				return {
					success: false,
					message: "Failed to create bucket",
					data: null
				}
			}
		}

		const uploadInfo = await minioClient.putObject(bucketName, file.name, file.data, file.size)
		return {
			success: true,
			message: "The file has been uploaded successfully.",
			data: uploadInfo,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "An error occurred while uploading the file.",
			data: null,
		}
	}
}

export const getFile = async (bucketName: string, fileName: string) => {
	try {
		const fileUrl = await minioClient.presignedGetObject(bucketName, fileName, 60 * 10)
		return {
			success: true,
			message: "File retrieved successfully",
			data: fileUrl,
		}
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: "An error occurred while retrieving the file.",
			data: null,
		}
	}
}
