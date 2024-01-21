import settings from "./settings.json" with { type: "json" };
import "./global.js";

export { consola as log } from "consola";
export { settings };
export * from "./firebase.js";
