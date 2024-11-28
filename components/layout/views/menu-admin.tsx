"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Para obtener la ruta actual
import {
  UsersIcon,
  ClockIcon,
  FileTextIcon,
  HomeIcon,
  BookOpenIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuAdminProps {
  logout: FC;
}

export const MenuAdmin: FC<MenuAdminProps> = ({ logout: Logout }) => {
  const pathname = usePathname(); // Obtener la ruta actual

  const links = [
    { href: "/dashboard/admin", label: "Inicio", Icon: HomeIcon },
    { href: "/dashboard/admin/users", label: "Usuarios", Icon: UsersIcon },
    { href: "/dashboard/admin/schedules", label: "Horarios", Icon: ClockIcon },
    {
      href: "/dashboard/admin/attendances",
      label: "Asistencias",
      Icon: BookOpenIcon,
    },
    {
      href: "/dashboard/admin/documents",
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

export default MenuAdmin;
