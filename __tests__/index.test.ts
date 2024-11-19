import * as fs from "node:fs";
import { z } from "zod";
import { generateEnvTypes, validateEnv } from "../src/index";

describe("Environment Validator", () => {
	// Schema for testing
	const schema = z.object({
		NODE_ENV: z.enum(["development", "production", "test"]),
		PORT: z.preprocess((v) => Number(v) || 0, z.number().int().nonnegative()),
		DATABASE_URL: z.string().url(),
		TRANSFORMED_VAR: z.string().transform((val) => val.toUpperCase()),
		OPTIONAL_VAR: z.string().optional(),
		BOOLEAN_FLAG: z.preprocess((v) => Boolean(v), z.boolean()),
	});

	beforeAll(() => {
		// Set environment variables for testing
		process.env.NODE_ENV = "development";
		process.env.PORT = "3000";
		process.env.DATABASE_URL = "https://example.com";
		process.env.TRANSFORMED_VAR = "lowercase";
		// process.env.OPTIONAL_VAR = undefined;
		process.env.BOOLEAN_FLAG = "true";
	});

	afterAll(() => {
		// Clean up environment variables
		process.env.NODE_ENV = undefined;
		process.env.PORT = undefined;
		process.env.DATABASE_URL = undefined;
		process.env.TRANSFORMED_VAR = undefined;
		// process.env.OPTIONAL_VAR = undefined;
		process.env.BOOLEAN_FLAG = undefined;
	});

	test("validateEnv should validate and transform environment variables", () => {
		const result = validateEnv(schema);

		// Expected result
		expect(result).toEqual({
			NODE_ENV: "development",
			PORT: 3000,
			DATABASE_URL: "https://example.com",
			TRANSFORMED_VAR: "LOWERCASE",
			BOOLEAN_FLAG: true,
		});
	});

	test("validateEnv should throw error if required variables are missing", () => {
		process.env.NODE_ENV = undefined; // Remove required variable

		expect(() => validateEnv(schema)).toThrow();
	});

	test("generateEnvTypes should create a valid TypeScript definition file", () => {
		const outputPath = "./__tests__/__results__/env.d.ts";
		generateEnvTypes(schema, outputPath);

		// Check if the type definition file is generated
		expect(fs.existsSync(outputPath)).toBe(true);

		// Validate the content of the file
		const generatedTypes = fs.readFileSync(outputPath, "utf-8");
		expect(generatedTypes).toContain(
			'NODE_ENV: "development" | "production" | "test";',
		);
		expect(generatedTypes).toContain("PORT: number;");
		expect(generatedTypes).toContain("DATABASE_URL: string;");
		expect(generatedTypes).toContain("TRANSFORMED_VAR: string;");
		expect(generatedTypes).toContain("BOOLEAN_FLAG: boolean;");

		const snapshotPath = "./__tests__/__snapshots__/env.d.ts";
		const snapshotGeneratedTypes = fs.readFileSync(snapshotPath, "utf-8");
		expect(generatedTypes).toBe(snapshotGeneratedTypes);

		// Delete the generated file
		fs.unlinkSync(outputPath);
	});
});
