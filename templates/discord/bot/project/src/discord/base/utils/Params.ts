export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type Dictionary<R extends string> =
    R extends `[${infer K}]` 
        ? Record<K, string[]> 
        : Record<R, string>;

export type Params<Path> = 
Path extends `/${string}` ? never :
Path extends `${string}/` ? never :
Path extends `${infer Segment}/${infer Rest}`
    ? Segment extends `:${infer Param}` 
        ? Dictionary<Param> & Params<Rest> 
        : Params<Rest>
    : Path extends `:${infer Param}` 
        ? Dictionary<Param> 
        : {}


export function getCustomIdParams(definition: string, customId: string){
    const regex = new RegExp(`^${definition.replace(/:[^\s/]+/g, "([^/]+)")}$`);
    const paramNames = definition.match(/:([^\s/]+)/g) || [];
    const match = customId.match(regex);
    
    if (!match) return null;
    
    const params = {} as Record<string, string | string[]>; 
    
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