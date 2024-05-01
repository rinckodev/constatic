interface StoreOptions {
    readonly clearTime?: number;
    readonly clearByDefault?: boolean;
}
export class Store<V, K extends string | number = string> {
    private store = new Map<K, V>();
    private clearTime?: number;
    private clearByDefault: boolean;
    constructor(options?: StoreOptions){
        const { clearTime, clearByDefault=true } = options ?? {};
        this.clearTime = clearTime;
        this.clearByDefault = clearByDefault;
    }
    public get defaultClearTime(){
        return this.clearTime; 
    }
    public get size(){
        return this.store.size;
    }
    public get keys(){
        return this.store.keys();
    }
    public get values(){
        return this.store.values();
    }
    public get entries(){
        return this.store.entries();
    }
    public get(key: K){
        return this.store.get(key);
    }
    public set(key: K, value: V, clearTime?: number | null, onDelete?: (value: V) => void){
        this.store.set(key, value);
        if (clearTime !== null || clearTime === undefined && this.clearByDefault){
            
            if (!clearTime && !this.clearTime) return this;

            setTimeout(() => {
                if (onDelete) onDelete(value);
                this.delete(key);
            }, clearTime ?? this.clearTime);
        }
        return this;
    }
    public clear(predicate?: (value: V, key: K) => boolean){
        if (predicate){
            for(const [key, value] of this.entries){
                if (predicate(value, key)) this.delete(key);
            }
            return;
        }
        this.store.clear();
    }
    public delete(key: K){
        return this.store.delete(key);
    }
    public has(key: K){
        return this.store.has(key); 
    }
    public find(predicate: (value: V, key: K) => boolean){
        for(const [key, value] of this.entries){
            if (predicate(value, key)) return value;
        }
        return undefined;
    }
    public forEach(callback: (value: V, key: K, store: Store<V, K>) => void){
        for(const [key, value] of this.store.entries()){
            callback(value, key, this);
        }
    }
    public map<U>(callback: (value: V, key: K) => U): U[]{
        const array: U[] = [];
        for(const [key, value] of this.entries){
            array.push(callback(value, key));
        }
        return array;
    }
    public filter<S extends V>(predicate: (value: V, index: number, array: V[]) => value is S): S[] {
        return this.toArray().filter(predicate);
    }
    public toArray(){
        return Array.from(this.values);
    }
}