type Fail = { success: false, error: string, code?: number }

export type ResultType<T, Key extends string = "data"> = 
    | ({ success: true } & Record<Key, T>)
    | Fail
    
export const Result = {
    ok<T, const K extends string = "data">(value: T, key?: K){
        key??="data" as K;
        return { success: true, [key]: value } as ResultType<T, K> & { success: true } 
    },
    fail(error: string, code?: number): Fail {
        return { success: false, error, code }
    }
}