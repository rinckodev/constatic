import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

declare global {
	var animated: true;
	var fetchReply: true;
	var ephemeral: true;
	var required: true;
	var inline: true;
	var disabled: true;

	var components: [];
	var embeds: [];

	var __rootname: string;
	var rootTo: (...path: string[]) => string;
	var getFilename: (meta: ImportMeta) => string;
	var getDirname: (meta: ImportMeta) => string;

	function importMeta(meta: ImportMeta): {
		__filename: string;
		__dirname: string;
	};
}

globalThis.animated = true;
globalThis.fetchReply = true;
globalThis.ephemeral = true;
globalThis.required = true;
globalThis.inline = true;
globalThis.disabled = true;

globalThis.components = [];
globalThis.embeds = [];

globalThis.__rootname = process.cwd();
globalThis.getFilename = (meta) => fileURLToPath(meta.url);
globalThis.getDirname = (meta) => dirname(getFilename(meta));
globalThis.rootTo = (...path: string[]) => join(__rootname, ...path);

globalThis.importMeta = (meta) => ({
	__filename: getFilename(meta),
	__dirname: getDirname(meta)
});
