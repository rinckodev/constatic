
type Fail = { success: false, error: string, code?: number };
type Success<T> = { success: true, data: T };

export type ResultType<T> = Success<T> | Fail;

export const Result = Object.freeze({
    ok<T>(data: T): Success<T> {
        return { success: true, data }
    },
    fail(error: string, code?: number): Fail {
        return { success: false, error, code }
    }
});