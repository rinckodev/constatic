import fs from "node:fs/promises";
import { CopyOptions, copy as fsCopy } from "fs-extra";
import { log } from "./log.js";
import { uiMessage } from "./ui.js";

export const json = {
    async read<T = any>(path: string): Promise<T> {
        const stringfiedJson = await fs.readFile(path, "utf-8");
        return JSON.parse(stringfiedJson);
    },
    async write<T = any>(path: string, data: T){
        const stringfiedJson = JSON.stringify(data, null, 2);
        fs.writeFile(path, stringfiedJson, "utf-8");
    }
}

export async function copy(src: string, dest: string, options?: CopyOptions){
  return fsCopy(src, dest, options)
    .catch((err) => {
      const message = [
        `src: ${src}`,
        `dest: ${dest}`,
        `${err}`
      ];
      log.fail(uiMessage({
        "pt-BR": [
          "Ocorreu um erro ao tentar copiar!",
          ...message
        ].join("\n"),
        "en-US": [
          "An error occurred while trying to copy",
          ...message
        ].join("\n")
      }))
  });
}