import { cn } from "@/utils/cn";

export const Button = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"button">) => {
  return (
    <button
      {...props}
      className={cn("rounded-sm border px-2", "cursor-pointer", className)}
    />
  );
};
