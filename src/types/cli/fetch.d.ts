export type FetchResult<T = undefined> = 
| {
    success: true,
    data: T
}
| {
    success: false,
    error: string
}