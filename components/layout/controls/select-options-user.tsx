"use client";

import { FC } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

import { SettingsIcon, LogOutIcon, CircleUserRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SelectOptionsUserProps {}

export const SelectOptionsUser: FC<SelectOptionsUserProps> = () => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/login";
  };

  const handleProfile = () => {
    router.push("/dashboard/user/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="bg-background/20 hover:bg-background/25 justify-start"
        >
          <SettingsIcon />
          Configuración
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px]">
        <DropdownMenuItem onSelect={handleProfile}>
          <CircleUserRoundIcon className="size-5" />
          <p className="text-base">Perfil</p>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOutIcon className="size-5" />
          <p className="text-base">Cerrar sesión</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectOptionsUser;
