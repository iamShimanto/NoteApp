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
    "bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950 shadow-lg shadow-violet-500/20 hover:brightness-110",
  secondary:
    "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10",
  ghost: "text-white/80 hover:bg-white/10",
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
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={[
          "inline-flex w-full items-center justify-center gap-2 font-semibold transition cursor-pointer",
          "focus:outline-none focus:ring-4 focus:ring-violet-500/15",
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
  }
);

Button.displayName = "Button";
