import ck from "chalk";

type FileTreeNode = {
	name: string;
	children?: FileTreeNode[];
};

function buildFileTree(paths: string[]): FileTreeNode[] {
	const root: FileTreeNode[] = [];

	for (const path of paths) {
		const parts = path.split("/");
		let currentLevel = root;

		for (const part of parts) {
			let existing = currentLevel.find(node => node.name === part);
			if (!existing) {
				existing = { name: part, children: [] };
				currentLevel.push(existing);
			}
			currentLevel = existing.children!;
		}
	}

	return root;
}

function formatFileTree(
	nodes: FileTreeNode[],
	prefix = ""
): string {
	let result = "";

	nodes.forEach((node, index) => {
		const isLastNode = index === nodes.length - 1;
		const branch = isLastNode ? "└─ " : "├─ ";

		const isDirectory = node.children && node.children.length > 0;
		const nodeName = isDirectory ? `${node.name}/` : ck.yellowBright(node.name);

		result += `${prefix}${branch}${nodeName}\n`;

		if (isDirectory) {
			const newPrefix = prefix + (isLastNode ? "   " : "│  ");
			result += formatFileTree(node.children!, newPrefix);
		}
	});

	return result;
}

export function buildAndFormatTree(paths: string[]): string {
	const tree = buildFileTree(paths);
	return formatFileTree(tree);
}


export function printRecordTree(title: string, deps: Record<string, string>): void {
	console.log(title);
	const entries = Object.entries(deps);

	entries.forEach(([key, value], index) => {
		const prefix = index === entries.length - 1 ? "└─" : "├─";
		console.log(`${prefix} ${key}@${value}`);
	});
}
