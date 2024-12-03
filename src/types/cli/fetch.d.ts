export type FetchResult<T = undefined, E = {}> = 
| {
    success: true,
    data: T
}
| (
    {
        success: false,
        error: string
    } 
    & E
)