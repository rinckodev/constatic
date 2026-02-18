import { CliCommand } from "@/components/constatic/cli/command";
import { ConstaticFlare } from "@/components/constatic/flare";
import { GridPattern } from "@/components/constatic/grid";
import { cn } from "@/lib/cn";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong, FaGithub, FaStar } from "react-icons/fa6";

const poppins = Poppins({ subsets: ["latin"], weight: "500" });

export default function HomePage() {
  return <main className="flex flex-1 flex-col z-10 items-center justify-center text-center gap-12">
      <ConstaticFlare />
      <div className="flex flex-col md:flex-row justify-center items-center motion-preset-expand motion-delay-[200ms]">
        <Image src={"/constatic.svg"} alt="logo" width={124} height={124} />
        <h1
          className={`${poppins.className} text-3xl lg:text-6xl uppercase bg-linear-to-r 
            dark:from-white from-black dark:to-neutral-400 to-neutral-500 bg-clip-text text-transparent
        `}>Constatic</h1>
      </div>
      <span className="justify-center items-center text-center text-sm lg:text-2xl px-24 max-w-5xl font-light text-wrap motion-preset-expand motion-delay-[300ms]">
        Creating modern and <span className="font-bold">awesome</span> projects has never been easier
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-full lg:flex-row gap-2 lg:gap-2 items-center justify-center motion-preset-expand motion-delay-[400ms]">
          <Link href={"https://github.com/rinckodev/constatic"}
            target="_blank"
            className="flex w-full items-center group border rounded-2xl px-3 py-1 gap-2"
          >
            <FaGithub className="size-4" />
            <span>Star on GitHub</span>
            <div className="flex items-center gap-1 text-sm md:flex">
              <FaStar className="size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300" />
            </div>
          </Link>
          <Link href={"/docs"}
            className="flex w-full items-center group border rounded-2xl px-3 py-1 gap-2"
          >
            <span className="">📄 Read the docs</span>
            <FaArrowRightLong size={10} />
          </Link>
        </div>
        <CliCommand
          packageName="constatic@latest"
        />
      </div>
      <GridPattern
        width={60}
        height={60}
        className={cn(
          "mask-[linear-gradient(-160deg,white,transparent,transparent)] ",
        )}
      />
    </main>
}
