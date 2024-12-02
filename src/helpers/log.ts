import ck from "chalk";

export const log = {
    success<T>(...data: T[]){
        console.log(`${ck.green("◆")} ${data.join(" ")}`)
    },
    fail<T>(...data: T[]){
        console.log(`${ck.red("◇")} ${data.join(" ")}`)
    },
    error<T>(...data: T[]){
        console.log(`${ck.red("■")} ${data.join(" ")}`)
    },
    warn<T>(...data: T[]){
        console.log(`${ck.yellow("▲")} ${data.join(" ")}`)
    }
}