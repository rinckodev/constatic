import { Language } from "#types";
import ck, { ChalkInstance } from "chalk";
import { cliLang, l } from "./lang.js";
import { Arg, ArgsDef, CommandDef, CommandMeta, Resolvable } from "citty";
export { setTimeout as sleep } from "node:timers/promises";

export function uiMessage(texts: Record<Language, string>, style?: ChalkInstance) {
    const lang = cliLang.get();
    return style ? style(texts[lang]) : texts[lang];
}

const keys = {
    tab: ck.cyan("<tab>"),
    enter: ck.cyan("<enter>"),
    get space() {
        return l({
            "en-US": ck.cyan("<space>"),
            "pt-BR": ck.cyan("<espaço>"),
        });
    },
    a: ck.cyan("<a>")
}

export const instructions = {
    get checkbox() {
        return "\n" + uiMessage({
            "en-US": `Controls: ${keys.space} select/deselect | ${keys.a} select all | ${keys.enter} proceed`,
            "pt-BR": `Controles: ${keys.space} selecionar/deselecionar | ${keys.a} selecionar tudo | ${keys.enter} prosseguir`
        }, ck.dim)
    },
    get searchSelect() {
        return () => {
            return "\n" + uiMessage({
                "en-US": `Controls: ${keys.tab} select/deselect | ${keys.enter} proceed`,
                "pt-BR": `Controles: ${keys.tab} selecionar/desselecionar | ${keys.enter} prosseguir`
            }, ck.dim);
        }
    }
}

export const commonTexts = {
    get back() {
        return uiMessage({
            "en-US": ck.dim(`⤶ Back`),
            "pt-BR": ck.dim(`⤶ Voltar`),
        })
    },
}

export const colors = {
    azoxo: "#5865F2"
};

export function divider() {
    console.log();
}

export const cliTableChars = {
    "top-left": "╭",
    "top-right": "╮",
    "bottom-right": "╯",
    "bottom-left": "╰",
}

function resolveValue<T extends CommandMeta | ArgsDef>(input: Resolvable<T>) {
    return typeof input === "function" ? input() : input;
}
export async function showUsage<T extends ArgsDef = ArgsDef>(
    cmd: CommandDef<T>,
    parent?: CommandDef<T>
): Promise<void> {
    const cmdMeta = await resolveValue(cmd.meta || {});
    const subCommands = Object.entries(
        await resolveValue(cmd.subCommands||{}) as Record<string, CommandDef>
    ).map(([name, cmd]) => ({ name, ...cmd }));

    const parentMeta = await resolveValue(parent?.meta || {});
    const args = Object.entries(
        await resolveValue((cmd.args || {}) as Record<string, Arg>)
    ).map(([name, arg]) => {
        arg.name = name;
        return arg;
    });

    const posArgs = args.filter(arg => arg.type === "positional");
    const flags = args.filter(arg => arg.type !== "positional");

    const options = subCommands.length >= 1
        ? `[subcommand]`
        : args.length >= 1
            ? (`[--flags] ` + posArgs.map(({ name }) => `<${name}>`).join(" "))
            : "";

    const command = parentMeta.name
        ? `${parentMeta.name} ${cmdMeta.name}`
        : cmdMeta.name;

    console.log(ck.dim(`${cmdMeta.description}`));

    console.log(ck.cyan("$"), ck.underline("Command usage:"), ck.cyan(command), ck.cyan(options));
    divider();

    if (subCommands.length >= 1) {
        console.log(ck.blue("$"), ck.underline("Subcommands:"));
        const maxLength = Math.max(
            ...subCommands.map(subcmd => subcmd.name.length)
        );

        for (const arg of subCommands) {
            const padded = `<${arg.name}>`.padEnd(maxLength + 2, " ");
            const meta = await resolveValue(arg.meta||{});
            console.log(
                `  ${ck.blue(padded)} ${ck.gray(meta.description)}`
            );
        }
        divider();
    }

    if (posArgs.length >= 1) {
        console.log(ck.blue("◆"), ck.underline("Command args:"));
        const maxLength = Math.max(
            ...posArgs.map(arg => arg.name.length)
        );

        for (const { name, description, valueHint: hint } of posArgs) {
            const padded = `<${name}>`.padEnd(maxLength + 2, " ");
            console.log(
                `  ${ck.blue(padded)} ${ck.gray(description)} ${hint ? `: ${hint}` : ""}`
            );
        }
        divider();
    }
    if (flags.length >= 1) {
        console.log(ck.blue("⚑"), ck.underline("Command flags:"));

        const maxLength = Math.max(
            ...flags.map(f => {
                const all = (Array.isArray(f.alias)
                    ? f.alias
                    : f.alias
                        ? [f.alias]
                        : []).map(a => (a.length === 1 ? `-${a}` : `--${a}`));
                all.push(`--${f.name}`);
                return all.join(", ").length;
            })
        );

        for (const flag of flags) {
            const aliases = (Array.isArray(flag.alias)
                ? flag.alias
                : flag.alias
                    ? [flag.alias]
                    : []
            ).map(alias =>
                alias.length === 1 ? `-${alias}` : `--${alias}`
            );

            aliases.push(`--${flag.name}`);
            const aliasStrPlain = aliases.join(", ");
            const padded = aliasStrPlain.padEnd(maxLength + 1, " ");

            console.log(
                `  ${ck.blue(padded)} ${ck.gray(flag.description)}`
            );
        }
    }
}