import type { ZodSchema } from "zod";
import { z } from "zod";

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

// Custom methods
const number = () =>
	z.preprocess((v) => Number(v) || 0, z.number().int().nonnegative());
const boolean = () => z.preprocess((v) => Boolean(v), z.boolean());

const g = {
	object: z.object,
	enum: z.enum,
	string: z.string,
	number,
	boolean,
};

export { g };
