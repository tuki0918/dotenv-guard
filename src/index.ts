import type { ZodSchema, z } from "zod";

export function validateEnv<T extends ZodSchema>(
	schema: T,
	env: NodeJS.ProcessEnv = process.env,
): z.infer<T> {
	const result = schema.safeParse(env);
	if (!result.success) {
		console.error(
			"Environment variable validation failed:",
			result.error.format(),
		);
		throw new Error("Invalid environment variables");
	}
	return result.data;
}
