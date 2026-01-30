import icons from "@/lib/icons";
import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";
import { createElement, type ReactElement, type ReactNode } from "react";

interface GenerateProps {
    title: ReactNode;
    description?: ReactNode;
    primaryTextColor?: string;
    icon?: string;
    site?: string;
}

export function generateOGImage(
    options: GenerateProps & ImageResponseOptions,
): ImageResponse {
    const { title, description, primaryTextColor, icon, site, ...rest } = options;

    return new ImageResponse(
        generate({
            title,
            description,
            primaryTextColor,
            icon,
            site,
        }),
        {
            width: 1430,
            height: 660,
            ...rest,
        },
    );
}

export function generate(props: GenerateProps): ReactElement {
    return <div tw="relative flex flex-col w-full h-full text-white bg-[#17181C] overflow-hidden border-[#26272C]">
        <div
            style={{
                position: "absolute",
                zIndex: 0,
                backgroundImage: `
          linear-gradient(to right, #ffffff 1px, transparent 1px),
          linear-gradient(to bottom, #ffffff 1px, transparent 1px)
        `,
                backgroundSize: "110px 110px",
                width: "100%",
                height: "100%",
                opacity: 0.2,
                maskImage: "linear-gradient(to bottom right, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom right, black, transparent)",
            }}
        />
        <div tw="
      w-full h-full text-4xl
      flex flex-col justify-between text-white
      py-20 px-32 border
    ">
            <div tw="flex flex-col" style={{
                gap: "0px"
            }}>
                <h1>
                    <span tw="flex flex-row font-500"
                        style={{
                            gap: "2rem",
                            fontWeight: 500
                        }}
                    >
                        {props.icon && createElement(icons[props.icon], {
                            width: "100",
                        })}
                        {props.title}
                    </span>
                </h1>
                <p tw="text-5xl text-neutral-200">{props.description}</p>
            </div>
            <span tw="flex flex-row text-neutral-300 text-5xl">
                {props.site}
            </span>
        </div>
    </div>
}