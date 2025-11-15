import type { ConstaticApp } from "../app.js";

export abstract class BaseManager {
    public readonly logs: string[];
    public readonly app: ConstaticApp;
    constructor(app: ConstaticApp){
        this.app = app;
        this.logs = [];
    }
}