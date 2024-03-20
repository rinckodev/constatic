export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type Dictionary<R extends string> =
    R extends `[${infer K}]` 
        ? Record<K, string[]> 
        : Record<R, string>;

export type Params<R extends string, I extends boolean = true, L = {}> = 
    I extends true ?
        R extends `/${string}` ? null :
        R extends `${string}/` ? null :
        R extends `${string}/:${infer Seg}/${infer Rest}` 
            ? Params<Rest, false, Dictionary<Seg>> :
        R extends `${string}/:${infer Seg}`
            ? Dictionary<Seg> : 
        null :
    R extends `:${infer Seg}/${infer Rest}` 
        ? Params<Rest, false, L & Dictionary<Seg>> : 
    R extends `${string}/:${infer Seg}/${infer Rest}`
        ? Params<Rest, false, L & Dictionary<Seg>> :
    R extends `${string}/:${infer Seg}`
        ? L & Dictionary<Seg> :
    R extends `:${infer Seg}` 
        ? L & Dictionary<Seg> : 
    L


export function getCustomIdParams(definition: string, customId: string){
    const regex = new RegExp(`^${definition.replace(/:[^\s/]+/g, "([^/]+)")}$`);
    const paramNames = definition.match(/:([^\s/]+)/g) || [];
    const match = customId.match(regex);
    
    if (!match) return null;
    
    const params = {} as { [x: string]: string | string[] };
    
    const arrayNameRegex = new RegExp(/^\[(.*)\]$/);

    match.slice(1).forEach((value, index) => {
        const paramName = paramNames[index].slice(1);
        const arrayParamName = paramName.match(arrayNameRegex);
        if (arrayParamName){
            params[arrayParamName[1]] = value.split(",").filter(Boolean);
        } else {
            params[paramName] = value;
        }
    });

    return params;
}

