import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiInfo, FiXCircle } from "react-icons/fi";
import { IoWarning } from "react-icons/io5";
import { MdLightbulbOutline } from "react-icons/md";

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  title?: ReactNode;
  /**
   * @defaultValue info
   */
  type?: "info" | "warn" | "danger" | "success" | "secondary" | "primary" | "hint";

  /**
   * Force an icon
   */
  icon?: ReactNode | boolean;
};

const calloutVariants = cva(
  `my-6 flex flex-row gap-2 rounded-lg border border-s-4 bg-fd-card p-4 text-sm text-fd-card-foreground shadow-md`,
  {
    variants: {
      type: {
        success: "border-s-4 border-l-green-500/50",
        danger: "border-s-4 border-l-red-500/50",
        warn: "border-s-4 border-l-amber-500/70",
        primary: "border-s-4 border-l-blue-500/50",
        secondary: "border-s-4 border-l-gray-500/50",
        hint: "border-s-4 border-l-yellow-500/70",
        info: "border-s-4 border-l-blue-500/50",
        error: "border-s-4 border-l-red-500/50",
      },
    },
  },
);

const calloutIcons = {
  success: <FaRegCircleCheck className="text-xl text-green-500"/>,
  danger: <BsExclamationCircle className="text-xl text-red-500"/>,
  warn: <IoWarning className="text-xl text-amber-500"/>,
  primary: <FiInfo className="text-xl text-blue-500"/>,
  secondary: <FaRegCircleCheck className="text-xl text-gray-500"/>,
  hint: <MdLightbulbOutline className="text-xl text-yellow-200"/>,
  info: <FiInfo className="text-xl text-blue-500"/>,
  error: <FiXCircle className="text-xl text-red-500"/>,
} as const;

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ type }), className, 
        "transition-all duration-300 ease-in-out")}
        {...props}
      >
        {icon ?? calloutIcons[type]}
        <div className="min-w-0 flex-1">
            {title && <p className="not-prose mb-2 font-medium">{title}</p>}
          <div className="text-fd-muted-foreground prose-no-margin">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Callout.displayName = "Callout";
