import { join } from "node:path";

declare global {
	const animated: true;
	const withResponse: true;
	const flags: ["Ephemeral"];
	const required: true;
	const inline: true;
	const disabled: true;
	const __rootname: string;
	const autocomplete: true;
	function rootTo(...path: string[]): string;
}

Object.assign(globalThis, Object.freeze({
	animated: true,
	withResponse: true,
	flags: ["Ephemeral"],
	required: true,
	inline: true,
	disabled: true,
	autocomplete: true,
	__rootname: process.cwd(),
	rootTo(...path: string[]){
		return join(process.cwd(), ...path);
	}
}));

