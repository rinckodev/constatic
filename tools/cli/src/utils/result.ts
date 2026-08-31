
type Fail = { success: false, error: string };
type Success<T> = { success: true, data: T };

export type ResultType<T> = Success<T> | Fail;

export const Result = Object.freeze({
    ok<T>(data: T): Success<T> {
        return { success: true, data }
    },
    fail(error: string): Fail {
        return { success: false, error }
    }
});