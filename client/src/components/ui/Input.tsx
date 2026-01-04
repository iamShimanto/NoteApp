import React from "react";

type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  size?: InputSize;
};

const sizeMap: Record<InputSize, string> = {
  sm: "h-9 text-sm px-3 rounded-lg",
  md: "h-11 text-sm px-4 rounded-xl",
  lg: "h-12 text-base px-4 rounded-xl",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      containerClassName = "",
      inputClassName = "",
      className,
      size = "md",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const describedById = `${inputId}-desc`;
    const hasDesc = Boolean(error || helperText);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold text-white/80"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          {leftIcon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-white/50">
              {leftIcon}
            </div>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={hasDesc ? describedById : undefined}
            disabled={disabled}
            className={[
              "w-full border bg-slate-950/40 text-white placeholder:text-white/35 outline-none transition",
              "focus:ring-4 focus:ring-violet-500/10",
              "disabled:cursor-not-allowed disabled:opacity-60",
              sizeMap[size],
              leftIcon ? "pl-11" : "",
              rightIcon ? "pr-11" : "",
              error
                ? "border-rose-400/40 focus:border-rose-300/50 focus:ring-rose-500/10"
                : "border-white/10 focus:border-violet-400/40",
              className ?? "",
              inputClassName,
            ].join(" ")}
            {...props}
          />

          {rightIcon ? (
            <div className="absolute inset-y-0 right-0 grid w-11 place-items-center text-white/60">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {hasDesc && (
          <p
            id={describedById}
            className={`mt-1.5 text-xs ${
              error ? "text-rose-300" : "text-white/50"
            }`}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
