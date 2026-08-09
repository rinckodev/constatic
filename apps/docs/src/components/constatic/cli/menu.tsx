import { Geist_Mono } from "next/font/google";
import { FaMinus } from "react-icons/fa6";
import { LuSquare, LuX } from "react-icons/lu";

const font = Geist_Mono({
  subsets: ["latin"]
});

type ChalkColor =
  | "black" | "red" | "green" | "yellow"
  | "blue" | "magenta" | "cyan" | "white"
  | "gray" | "grey"
  | "redBright" | "greenBright" | "yellowBright"
  | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";

type TextStyle = "bold" | "italic" | "underline" | "line-through";

type CliMenuItem = {
  id?: string;
  label: string;
  color?: ChalkColor;
  icon?: string;
  iconColor?: ChalkColor;
  style?: TextStyle[];
  // selected?: boolean;
};

interface CLIMenuProps {
  items: CliMenuItem[];
  selected?: string[];
  hidden?: string[]
}

const chalkToTailwindMap: Record<ChalkColor, string> = {
  black: "text-black",
  red: "text-red-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  blue: "text-blue-500",
  magenta: "text-pink-500",
  cyan: "text-cyan-500",
  white: "text-white",
  gray: "text-gray-500",
  grey: "text-gray-500",
  redBright: "text-red-400",
  greenBright: "text-green-400",
  yellowBright: "text-yellow-400",
  blueBright: "text-blue-400",
  magentaBright: "text-pink-400",
  cyanBright: "text-cyan-400",
  whiteBright: "text-white"
};

const styleToTailwindMap: Record<TextStyle, string> = {
  bold: "font-bold",
  italic: "italic",
  underline: "underline",
  "line-through": "line-through"
};

export function CliMenu(props: CLIMenuProps) {
  const { hidden = [], selected = [], items } = props;
  return (
    <div className={`${font.className} w-full flex flex-col border-2 items-start rounded-md`}>
      <div className="flex justify-end w-full p-1 bg-fd-muted rounded-t-sm">
        <span className="flex flex-row gap-2 items-center text-fd-muted-foreground">
          <FaMinus size={16} />
          <LuSquare size={16} />
          <LuX size={16} />
        </span>
      </div>
      <div className={` w-full flex flex-col rounded-b-sm items-start p-2 bg-fd-background`}>
        {items.filter(item => !hidden.includes(item.id ?? "")).map((item, key) => {
          const textColorClass = item.color ? chalkToTailwindMap[item.color] : "";
          const iconColorClass = item.iconColor
            ? chalkToTailwindMap[item.iconColor]
            : textColorClass;
          const styleClasses = item.style?.map(style => styleToTailwindMap[style]).join(" ") ?? "";

          const bg = (item.id && selected.includes(item.id)) ? "bg-blue-500/20" : "";

          return (
            <span key={key} className={` flex px-2 py-[0.5px] text-sm rounded-md w-full items-center ${bg} ${textColorClass} ${styleClasses}`}>
              {item.icon ? (
                <span className={iconColorClass}>{item.icon} {item.label}</span>
              ) : item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

type Lang = "pt" | "en";

interface DefaultCliMenuProps {
  lang: Lang,
  selected?: string[],
  hidden?: string[]
};

function createUiMessage(lang: Lang) {
  return function uiMessage(message: Record<Lang, string>) {
    return message[lang]
  }
};

export const CliMenus = {
  Main({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "❑", color: "cyan", style: ["underline"],
        label: txt({ en: "Main menu", pt: "Menu principal" }),
      },
      {
        icon: "◈", color: "green", id: "init",
        label: txt({ en: "Init discord bot project", pt: "Iniciar projeto de bot de discord" }),
      },
      {
        icon: "◈", color: "green", id: "emojis",
        label: txt({ en: "Manage discord emojis", pt: "Gerenciar emojis de discord" }),
      },
      {
        icon: "◈", color: "cyan", id: "presets",
        label: txt({ en: "Manage presets", pt: "Gerenciar predefinições" }),
      },
      {
        icon: "☰", color: "blue", id: "settings",
        label: txt({ en: "Settings", pt: "Configurações" }),
      },
      {
        icon: "✕", color: "red", id: "quit",
        label: txt({ en: "Quit", pt: "Sair" }),
      },
    ]} />
  },
  Databases({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);



    return <CliMenu {...props} items={[
      {
        icon: "◆", color: "cyan",
        label: txt({ en: "🧰 Database preset", pt: "🧰 Predefinição de banco de dados" }),
      },
      {
        color: "red", id: "none",
        label: txt({ en: "None", pt: "Nenhum" })
      },
      {
        icon: "🍃", color: "white", id: "mongoose",
        label: "MongoDb (mongoose)"
      },
      {
        icon: "🧊", color: "white", id: "quickdb",
        label: "QuickDB (better-sqlite3)",
      },
      {
        icon: "🦕", color: "white", id: "typesaurus",
        label: "Firestore (typesaurus)",
      },
      {
        icon: "🔥", color: "white", id: "firelord",
        label: "Firestore (firelord)",
      },
      {
        icon: "🐬", color: "white", id: "mysql",
        label: "MySQL (sql)",
      },
      {
        icon: "🦭", color: "white", id: "mariadb",
        label: "MariaDb (sql)",
      },
      {
        icon: "💎", color: "white", id: "prisma",
        label: "Prisma (orm)",
      },
    ]} />
  },
  Servers({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "◆", color: "cyan",
        label: txt({ en: "🌐 API Server", pt: "🌐 Servidor API" }),
      },
      {
        icon: "🐅", color: "green", id: "fastify",
        label: "Fastify (fastify)"
      },
      {
        icon: "🦎", color: "green", id: "express",
        label: "ExpressJS (express)",
      },
    ]} />
  },
  Presets({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "❑", color: "cyan", style: ["underline"],
        label: txt({ en: "Presets", pt: "Predefinições" }),
      },
      {
        icon: "🗐", color: "green", id: "scripts",
        label: "Scripts"
      },
      {
        icon: "☵", color: "green", id: "tokens",
        label: "Tokens",
      },
      {
        icon: "⤶", color: "gray", id: "back",
        label: txt({ en: "Back", pt: "Voltar" })
      },
    ]} />
  },
  Tokens({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "❑", color: "cyan", style: ["underline"],
        label: txt({ en: "Manage tokens", pt: "Gerenciar tokens" }),
      },
      {
        icon: "✦", color: "green", id: "new",
        label: txt({ en: "New token", pt: "Novo token" }),
      },
      {
        icon: "☰", color: "blue", id: "list",
        label: txt({ en: "List tokens", pt: "Listar tokens" }),
      },
      {
        icon: "✎ ", color: "yellow", id: "edit",
        label: txt({ en: "Edit token", pt: "Editar token" }),
      },
      {
        icon: "✗", color: "red", id: "delete",
        label: txt({ en: "Delete tokens", pt: "Excluir tokens" }),
      },
      {
        icon: "⤶", color: "gray", id: "back",
        label: txt({ en: "Back", pt: "Voltar" }),
      },
    ]} />
  },
  Scripts({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "❑", color: "cyan", style: ["underline"],
        label: txt({ en: "Manage script presets", pt: "Gerenciar predefinições de scripts" }),
      },
      {
        icon: "✦", color: "green", id: "new",
        label: txt({ en: "New preset", pt: "Nova predefinição" }),
      },
      {
        icon: "☰", color: "blue", id: "list",
        label: txt({ en: "List preset", pt: "Listar predefinições" }),
      },
      {
        icon: "↯", color: "magenta", id: "apply",
        label: txt({ en: "Apply preset", pt: "Aplicar predefinições" }),
      },
      {
        icon: "✎ ", color: "yellow", id: "edit",
        label: txt({ en: "Edit preset", pt: "Editar predefinição" }),
      },
      {
        icon: "✗", color: "red", id: "delete",
        label: txt({ en: "Delete preset", pt: "Excluir predefinições" }),
      },
      {
        icon: "⤶", color: "gray", id: "back",
        label: txt({ en: "Back", pt: "Voltar" }),
      },
    ]} />
  },
  ModifyScript({ lang, ...props }: DefaultCliMenuProps) {
    const txt = createUiMessage(lang);

    return <CliMenu {...props} items={[
      {
        icon: "❑", color: "cyan", style: ["underline"],
        label: txt({ en: "New script preset", pt: "Nova predefinições de script" }),
      },
      {
        icon: "🗐", color: "green", id: "files",
        label: txt({ en: "Select files", pt: "Selecionar arquivos" }),
      },
      {
        icon: "✗", color: "red", id: "rm",
        label: txt({ en: "Remove files", pt: "Remover arquivos" }),
      },
      {
        icon: "☶", color: "green", id: "deps",
        label: txt({ en: "Add dependencies", pt: "Adicionar dependências" }),
      },
      {
        icon: "✗ ", color: "red", id: "uninstall",
        label: txt({ en: "Remove dependencies", pt: "Remover dependências" }),
      },
      {
        icon: "⦿", color: "green", id: "preview",
        label: txt({ en: "Preview", pt: "Previsualizar" }),
      },
      {
        icon: "↯ ", color: "green", id: "save",
        label: txt({ en: "Save", pt: "Salvar" }),
      },
      {
        icon: "⤶", color: "redBright", id: "cancel",
        label: txt({ en: "Cancel", pt: "Cancelar" }),
      },
    ]} />
  },
}
