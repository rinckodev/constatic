import { addRoute, createRouter, findRoute, removeRoute, type MatchedRoute, type RouterContext } from "rou3";

export class Router<T> {
    private router: RouterContext<T>
    constructor() {
        this.router = createRouter<T>()
    }
    public add(method: string, path: string, data?: T): void {
        addRoute(this.router,
            method.toUpperCase(),
            this.resolvePath(path),
            data
        );
    }
    public find(method: string, path: string): MatchedRoute<T> | undefined {
        return findRoute(this.router,
            method.toUpperCase(),
            this.resolvePath(path),
        );
    }
    public remove(method: string, path: string): void {
        removeRoute(this.router,
            method.toUpperCase(),
            this.resolvePath(path),
        );
    }
    private resolvePath(path: string) {
        return path.startsWith("/") ? path : `/${path}`
    }
}