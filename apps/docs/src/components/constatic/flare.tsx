import { cn } from "fumadocs-ui/utils/cn";

interface ConstaticFlareProps {
    className?: string;
}
export function ConstaticFlare({ className }: ConstaticFlareProps){
    return <div
    aria-hidden="true"
    className={cn(
      `pointer-events-none absolute inset-0 flex items-center justify-center
      before:absolute before:rounded-full before:content-['']
      before:bg-linear-to-r before:from-[#0141ff] before:to-[#60c5ff]
      before:blur-[100px]
      before:opacity-30
      before:rotate-[-32deg]
      before:w-[140px] before:h-[500px]
      before:translate-x-[-30%] before:translate-y-[-30%]
  
      sm:before:w-[140px] sm:before:h-[700px]
      lg:before:w-[240px] lg:before:h-[700px]`,
      className
    )}
  />
  
}

