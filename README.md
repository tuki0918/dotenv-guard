# dotenv-guard

You can use the provided zod-based schema for .env to access environment variables with type-safe.


```
// .env
NODE_ENV = "development";
PORT = "3000";
TRANSFORMED_VAR = "lowercase";
BOOLEAN_FLAG = "true";
```

```
// usage
import { g, validateEnv } from "...";

const schema = g.object({
    NODE_ENV: g.enum(["development", "production", "test"]),
    PORT: g.number(),
    TRANSFORMED_VAR: g.string().transform((val) => val.toUpperCase()),
    OPTIONAL_VAR: g.string().optional(),
    BOOLEAN_FLAG: g.boolean(),
});

const env = validateEnv(schema);
// NODE_ENV: "development"
// PORT: 3000
// TRANSFORMED_VAR: "LOWERCASE"
// BOOLEAN_FLAG: true

export { env };
```
