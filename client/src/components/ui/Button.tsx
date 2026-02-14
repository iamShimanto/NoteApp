import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-base rounded-xl",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400",
  secondary:
    "border border-white/10 bg-slate-950/40 text-white/90 hover:bg-slate-950/60",
  ghost: "text-white/80 hover:bg-slate-950/40",
  danger:
    "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400",
};

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={[
          "inline-flex w-full items-center justify-center gap-2 font-semibold transition cursor-pointer",
          "focus:outline-none focus:ring-4 focus:ring-white/10",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "select-none",
          sizeMap[size],
          variantMap[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {isLoading ? <Spinner /> : leftIcon ? <span>{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span>{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
