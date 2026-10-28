import { ck } from "#utils/ck.js";

export const log = {
    icon: {
        success: "✓",
        fail: "◇",
        error: "✖︎",
        warn: "▲"
    },
    success<T>(...data: T[]){
        console.log(`${ck.green(log.icon.success)}`, ...data)
    },
    fail<T>(...data: T[]){
        console.error(`${ck.red(log.icon.fail)}`, ...data)
    },
    error<T>(...data: T[]){
        console.error(`${ck.red(log.icon.error)}`, ...(data.map(d => ck.red(`${d}`))))
    },
    warn<T>(...data: T[]){
        console.warn(`${ck.yellow(log.icon.warn)}`, ...data)
    },
    custom<T>(prefix: string, ...data: T[]){
        console.log(prefix, ...data)
    },
}