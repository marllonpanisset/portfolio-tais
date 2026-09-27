import type {
  ButtonHTMLAttributes,
  ComponentProps,
  PropsWithChildren,
} from "react";

import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type BaseProps = PropsWithChildren<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}>;

interface ButtonAsButton
  extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, "href" | "className" | "children"> & {
    href: Route;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-b from-signal-strong to-signal
    text-white
    border border-white/15
    shadow-[var(--shadow-button)]

    hover:from-signal hover:to-signal-strong
    hover:border-white/20
    hover:shadow-[var(--shadow-button-hover)]
    hover:brightness-[1.03]

    active:brightness-95

    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-signal
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,

  secondary: `
    border border-border/70
    bg-surface-elevated/75
    text-text-primary
    backdrop-blur-sm
    shadow-sm

    hover:border-border
    hover:bg-surface-elevated
    hover:shadow-md

    active:bg-surface

    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-signal
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,

  ghost: `
    text-text-secondary

    hover:bg-surface
    hover:text-text-primary

    active:bg-surface-elevated

    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-signal
    focus-visible:ring-offset-2 focus-visible:ring-offset-background
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  md: `h-10 px-5 text-[0.9375rem]`,
  lg: `h-12 px-7 text-base`,
};

const base = `
  inline-flex items-center justify-center gap-2
  rounded-[var(--radius-md)]
  font-medium
  leading-none
  whitespace-nowrap
  cursor-pointer
  transition-[background-color,border-color,color,box-shadow,filter]
  duration-150 ease-out
  select-none
  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:shadow-none
`;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variantStyles[variant], sizeStyles[size], className);

  if (props.href !== undefined) {
    const { href, ...linkProps } = props;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
