import { join } from "node:path";

declare global {
	const animated: true;
	const fetchReply: true;
	const ephemeral: true;
	const required: true;
	const inline: true;
	const disabled: true;
	const __rootname: string;
	function rootTo(...path: string[]): string;
}

Object.assign(globalThis, {
	animated: true,
	fetchReply: true,
	ephemeral: true,
	required: true,
	inline: true,
	disabled: true,
	__rootname: process.cwd(),
	rootTo(...path: string[]){
		return join(process.cwd(), ...path);
	}
});