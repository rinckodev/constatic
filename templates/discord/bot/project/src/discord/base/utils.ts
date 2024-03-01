type Dictionary<R extends string> =
    R extends `[${infer K}]` ? { [Key in K]: string[] } :
    { [Key in R]: string }

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

// export type Params<T extends string, P extends boolean = false> = 
//     P extends false 
//         ? T extends `/${string}` ? never 
//         : T extends `${string}/` ? never
//             : T extends `${string}/:${infer ParamName}/${infer Rest}`
//             ? { [K in ParamName | keyof Params<Rest, true>]: string }
//             : T extends `${string}/:${infer ParamName}`
//             ? { [K in ParamName]: string }
//             : null
//         : T extends `:${infer ParamName}/${infer Rest}` 
//             ? { [K in ParamName | keyof Params<Rest, true>]: string } 
//             : T extends `:${infer ParamName}` 
//             ? { [K in ParamName]: string } 
//             : T extends `${string}/:${infer ParamName}/${infer Rest}` 
//             ? { [K in ParamName | keyof Params<Rest, true>]: string }
//             : T extends `${string}/:${infer ParamName}` 
//             ? { [K in ParamName]: string }
//             : T extends `/:${infer ParamName}/${infer Rest}` 
//             ? { [K in ParamName | keyof Params<Rest, true>]: string } 
//             : null