// components/layout/Container.tsx
import { ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx("mx-auto max-w-6xl px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
