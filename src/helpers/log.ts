import ck from "chalk";

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
        console.log(`${ck.red(log.icon.fail)}`, ...data)
    },
    error<T>(...data: T[]){
        console.log(`${ck.red(log.icon.error)}`, ...data)
    },
    warn<T>(...data: T[]){
        console.log(`${ck.yellow(log.icon.warn)}`, ...data)
    },
    custom<T>(prefix: string, ...data: T[]){
        console.log(prefix, ...data)
    },
}