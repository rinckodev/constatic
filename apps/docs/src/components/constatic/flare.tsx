import { cn } from "@/lib/cn";

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
      before:w-35 before:h-125
      before:translate-x-[-30%] before:translate-y-[-30%]
  
      sm:before:w-35 sm:before:h-175
      lg:before:w-60 lg:before:h-175`,
      className
    )}
  />
  
}

