type StringRecord<K extends string = string> = Record<K, string>;
type RecordKeys = keyof StringRecord;
type ResolveKeys<T extends StringRecord | RecordKeys> = 
    T extends Record<infer K, string> ? K : T;

export class URLStore<S extends StringRecord | RecordKeys = StringRecord, K extends RecordKeys = ResolveKeys<S>> {
    private url = new URL("https://discord.com");
    private get lengthLimit(){
        return 2048;
    }
    constructor(url?: string | null){
        if (url && url.length <= this.lengthLimit){
            this.url = new URL(url);
        }
    }
    public get length(){
        return this.toString().length;
    }
    public get record(){
        return Array.from(this.url.searchParams.entries())
        .reduce(
            (params, [key, value]) => 
                Object.assign(params, { [key]: value }),
            {} as Record<K, string | undefined>
        );
    }
    public get(key: K): string | null {
        return this.url.searchParams.get(key);
    }
    public canBeSet(key: string, value: string){
        const mock = new URL(this.url.toString());
        mock.searchParams.set(key, value);
        return mock.toString().length <= this.lengthLimit;
    }
    public set(key: K, value: string){
        const canBeSet = this.canBeSet(key, value);
        if (canBeSet){
            this.url.searchParams.set(key, value);
        }
        return canBeSet;
    }
    public has(key: K, value?: string){
        return this.url.searchParams.has(key, value);
    }
    public delete(key: K, value?: string){
        this.url.searchParams.delete(key, value);
    }
    public toString(){
        return this.url.toString();
    }
    public toMap(){
        return new Map(this.url.searchParams.entries());
    }
    public keys(){
        return this.url.searchParams.keys();
    }
    public values(){
        return this.url.searchParams.values();
    }
}