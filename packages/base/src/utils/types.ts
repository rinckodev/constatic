export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type NotEmptyArray<T> = T extends never[] ? never : T;

// https://stackoverflow.com/a/64519702
export type UniqueArray<T> =
    T extends readonly [infer X, ...infer Rest]
    ? InArray<Rest, X> extends true
    ? ["Encountered value with duplicates:", X]
    : readonly [X, ...UniqueArray<Rest>]
    : T

type InArray<T, X> =
    T extends readonly [X, ...infer _Rest] ? true :
    T extends readonly [X] ? true :
    T extends readonly [infer _, ...infer Rest]
    ? InArray<Rest, X>
    : false