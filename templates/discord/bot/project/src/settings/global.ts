import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

declare global {
	const animated: true;
	const fetchReply: true;
	const ephemeral: true;
	const required: true;
	const inline: true;
	const disabled: true;

	const __rootname: string;

	function rootTo(...path: string[]): string;
	function getFilename(meta: ImportMeta): string;
	function getDirname(meta: ImportMeta): string;

	function importMeta(meta: ImportMeta): {
		__filename: string;
		__dirname: string;
	};
}

Object.defineProperties(globalThis, {
	animated:{ value: true },
	fetchReply:{ value: true },
	ephemeral:{ value: true },
	required:{ value: true },
	inline:{ value: true },
	disabled:{ value: true },
	__rootname:{ value: process.cwd() }
});

Object.defineProperties(globalThis, {
	getFilename: {
		value(meta: ImportMeta){
			return fileURLToPath(meta.url);
		}
	},
	getDirname: {
		value(meta: ImportMeta){
			return dirname(getFilename(meta));
		}
	},
	rootTo: {
		value(...path: string[]){
			return join(__rootname, ...path);
		}
	}
});

Object.defineProperties(globalThis, {
	importMeta:{
		value(meta: ImportMeta){
			return {
				__filename: getFilename(meta),
				__dirname: getDirname(meta)
			};
		}
	}
});