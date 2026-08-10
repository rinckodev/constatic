import { ImageResponseOptions } from "next/server";
import { readFile } from "node:fs/promises";

const gridSvg = encodeURIComponent(
  `<svg width="92" height="92" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="M 92 0 L 0 0 0 92" fill="none" stroke="rgba(167,169,180,0.2)" stroke-width="1"/></svg>`
);

const GRID_BG = `url("data:image/svg+xml,${gridSvg}")`;

const fonts = [
    readFile("./src/lib/og/JetBrainsMono-Regular.ttf").then(
        data => ({
            name: "JetBrainsMono",
            data,
            weight: 400,
        } as const)
    )
];

export async function getImageResponseOptions(){
    return {
        width: 1200,
        height: 630,
        fonts: await Promise.all(fonts)
    } satisfies ImageResponseOptions;
}

export default function Og() {

  return <div 
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "space-between",
            width: '100%',
            height: '100%',
            backgroundColor: '#121317',
            backgroundImage: GRID_BG,
            backgroundPosition: "center",
            color: '#ffffff',
            padding: 64,
            fontFamily: '"JetBrainsMono", monospace'
        }}
  >  
    <div
        style={{
            display: "flex",
            flexDirection: "column"
        }}
    >
        <h1
            style={{
                fontFamily: "sans-serif",
                fontSize: 100
            }}
        >CONSTATIC</h1>
        <p
            style={{
                fontSize: 42

            }}
        >
            Creating modern and awesome projects has never been easier
        </p>
    </div>
  </div>
}