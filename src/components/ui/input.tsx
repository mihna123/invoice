import { cn } from "@/utils/cn";

export const Input = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"input">) => {
  return (
    <input
      {...props}
      className={cn("rounded-sm border px-2 py-1", className)}
    />
  );
};
