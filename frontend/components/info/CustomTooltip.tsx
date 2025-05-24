import { cn } from "@/lib/utils";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "../ui/tooltip";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

export function withTooltip(label: string, htmlFor: string, tooltip: string) {
  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      <CustomTooltip description={tooltip}>
        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
      </CustomTooltip>
    </div>
  );
}

export function CustomTooltip({
  description,
  children,
  className,
}: {
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild className={cn(className)}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-wrap w-fit max-w-60">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
