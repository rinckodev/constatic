interface StoreOptions {
    clearTime?: number;
}
interface StoreSetOptions {
    time?: number;
    beforeEnd?(): boolean;
}
export class Store<V, K extends string | number | symbol = string>{
    private store = new Map<K, V>();
    private clearTime?: number;
    constructor(options: StoreOptions = {}){
        this.clearTime = options.clearTime;
    }
    public get size(){
        return this.store.size;
    }
    public get defaultClearTime(){
        return this.clearTime;
    }
    public set(key: K, value: V, options: StoreSetOptions = {}){
        this.store.set(key, value);
        if (options.time ?? this.clearTime){
            setTimeout(() => {
                if (!options.beforeEnd){
                    this.delete(key);
                    return;
                }
                if (options.beforeEnd()){
                    this.delete(key);
                    return;
                }
            }, options.time ?? this.clearTime);
        }
    }
    public delete(key: K){
        this.store.delete(key);
    }
    public get(key: K): V | undefined {
        return this.store.get(key);
    }
    public has(key: K){
        return this.store.has(key);
    }
    public getMap(){
        return this.store;
    }
}
