import { g, validateEnv } from "../src/index";

describe("Environment Validator", () => {
	// Schema for testing
	const schema = g.object({
		NODE_ENV: g.enum(["development", "production", "test"]),
		PORT: g.number(),
		DATABASE_URL: g.string().url(),
		TRANSFORMED_VAR: g.string().transform((val) => val.toUpperCase()),
		OPTIONAL_VAR: g.string().optional(),
		BOOLEAN_FLAG: g.boolean(),
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
});
