import { RecordKey } from "../base.types.js";

interface StoreOptions {
    clearTime?: number;
}
interface StoreSetOptions {
    time?: number;
    beforeEnd?(): boolean;
}
export class Store<V, K extends RecordKey = string> extends Map<K, V> {
    private clearTime?: number;
    public get defaultClearTime(){
        return this.clearTime;
    }
    constructor(options: StoreOptions = {}){
        super();
        this.clearTime = options.clearTime;
    }
    override set(key: K, value: V, options: StoreSetOptions = {}){
        super.set(key, value);
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
        return this;
    }
    override get(key: K): V | undefined
    override get(key: K, fallback: V): V
    override get(key: K, fallback?: V){
        return super.get(key) ?? fallback;
    }
}