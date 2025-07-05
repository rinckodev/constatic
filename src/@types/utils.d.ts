export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type FetchResult<T = undefined, E = {}> = 
| { success: true, data: T }
| ({ success: false, error: string } & E)