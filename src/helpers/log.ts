import ck from "chalk";

export const log = {
    success<T>(...data: T[]){
        console.log(`${ck.green("◆")}`, ...data)
    },
    fail<T>(...data: T[]){
        console.log(`${ck.red("◇")}`, ...data)
    },
    error<T>(...data: T[]){
        console.log(`${ck.red("■")}`, ...data)
    },
    warn<T>(...data: T[]){
        console.log(`${ck.yellow("▲")}`, ...data)
    }
}