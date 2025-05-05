import React from "react";
import { twMerge } from "tailwind-merge";
type SeparatorProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};
const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        `my-2 border-1 border-line-gray border-solid  data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px`,
        className
      )}
    ></div>
  );
};

export default Separator;
