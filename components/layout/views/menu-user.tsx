"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Obtener la ruta actual
import { BookOpenIcon, ClockIcon, FileTextIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuUserProps {
  logout: FC;
}

export const MenuUser: FC<MenuUserProps> = ({ logout: Logout }) => {
  const pathname = usePathname(); // Obtener la ruta actual

  const links = [
    { href: "/dashboard/user", label: "Inicio", Icon: HomeIcon },
    { href: "/dashboard/user/schedules", label: "Horarios", Icon: ClockIcon },
    {
      href: "/dashboard/user/attendances",
      label: "Asistencias",
      Icon: BookOpenIcon,
    },
    {
      href: "/dashboard/user/documents",
      label: "Documentos",
      Icon: FileTextIcon,
    },
  ];

  return (
    <aside className="bg-primary text-primary-foreground p-5 grid grid-rows-[1fr_auto]">
      <nav className="flex flex-col gap-5">
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
                isActive
                  ? "bg-background text-primary"
                  : "bg-background/5 hover:bg-background hover:text-primary"
              )}
            >
              <Icon className="size-6" />
              <span className="text-xl font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <Logout />
    </aside>
  );
};

export default MenuUser;
