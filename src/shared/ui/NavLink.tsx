"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

export function NavLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCurrent) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onClick?.(e);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
