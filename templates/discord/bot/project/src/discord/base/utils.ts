
export type Params<T> = 
T extends `${string}:${infer Param}/${infer Rest}`
? { [K in Param | keyof Params<Rest>]: string } 
: T extends `${string}:${infer LastParam}` 
? { [K in LastParam]: string } 
: null

export function getCustomIdParams(definition: string, customId: string){
    const regex = new RegExp(`^${definition.replace(/:[^\s/]+/g, "([^/]+)")}$`);
    const paramNames = definition.match(/:([^\s/]+)/g) || [];
    const match = customId.match(regex);
    
    if (!match) return null;
    
    const params = {} as Record<string, string>;
    
    match.slice(1).forEach((value, index) => {
        const paramName = paramNames[index].slice(1);
        params[paramName] = value;
    });

    return params;
}