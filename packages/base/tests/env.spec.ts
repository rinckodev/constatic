//@ts-nocheck
import { validateEnv } from "#package";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import type { StandardSchemaV1 } from "../src/utils/schema.js";

function createSuccessSchema<T>(value: T): StandardSchemaV1<any, T> {
    return {
        "~standard": {
            version: 1,
            vendor: "test",
            validate: () => ({ value })
        }
    };
}

function createFailureSchema(issues: StandardSchemaV1.Issue[]): StandardSchemaV1 {
    return {
        "~standard": {
            version: 1,
            vendor: "test",
            validate: () => ({ issues })
        }
    };
}

let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
    originalEnv = process.env;
    process.env = { TEST: "123" };
});

afterEach(() => {
    process.env = originalEnv;
    mock.restore();
});

describe("validateEnv", () => {
    it("returns parsed value when schema is valid", async () => {
        const schema = createSuccessSchema({ ok: true });
        const result = await validateEnv(schema);
        expect(result).toEqual({ ok: true });
    });

    it("logs success message when validation passes", async () => {
        const schema = createSuccessSchema({ ok: true });
        const log = mock(() => {});
        console.log = log;
        await validateEnv(schema);
        const msg = log.mock.calls[0][0];
        expect(msg).toContain("Environment variables validated");
    });

    it("calls process.exit(1) when validation fails", async () => {
        const schema = createFailureSchema([
            { message: "Missing required variable", path: ["DATABASE_URL"] }
        ]);

        const log = mock(() => {});
        console.log = log;

        const exit = mock(() => {});
        process.exit = exit;

        await validateEnv(schema);

        expect(exit).toHaveBeenCalledWith(1);

        const output = log.mock.calls.map(c => c[0]).join("\n");
        expect(output).toContain("ENV VAR");
        expect(output).toContain("DATABASE_URL");
        expect(output).toContain("Missing required variable");
    });

    it("calls schema.validate with process.env", async () => {
        const validate = mock(() => ({ value: { ok: true } }));

        const schema: StandardSchemaV1 = {
            "~standard": {
                version: 1,
                vendor: "test",
                validate,
            }
        };

        await validateEnv(schema);

        expect(validate).toHaveBeenCalledWith(process.env);
    });
});
