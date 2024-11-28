"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui";
import { EditUser } from "@/components/users";
import { DialogProvider } from "@/contexts";
import { useDeactiveUser, useDeleteUser } from "@/hooks";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontalIcon,
  UserRoundMinusIcon,
  UserRoundXIcon,
} from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "last_name",
    header: "Apellido",
  },
  {
    accessorKey: "address",
    header: "Direccion",
  },
  {
    accessorKey: "phone",
    header: "Telefono",
  },
  {
    accessorKey: "salary",
    header: "Salario",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "updated_at",
    header: "F. Actualizacion",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [deactiveUser, loadingDeactive] = useDeactiveUser();
      const [deleteUser, loadingDelete] = useDeleteUser();

      const loading = loadingDeactive || loadingDelete;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-accent rounded-lg">
            <MoreHorizontalIcon className="size-6 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
            <DialogProvider>
              <EditUser userID={id} />
            </DialogProvider>
            <DropdownMenuItem className="p-0">
              <Button
                disabled={loading}
                onClick={() => deactiveUser(id)}
                variant={"ghost"}
                className="w-full justify-start px-2"
              >
                <UserRoundMinusIcon />
                Desactivar
              </Button>
            </DropdownMenuItem>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={loading}
                  variant={"ghost"}
                  className="w-full justify-start px-2"
                >
                  <UserRoundXIcon />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estas seguro que deseas eliminar este usuario?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta accion no se podra reversir, esto eliminara cualquier
                    registro de este usuario hasta el momento
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteUser(id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
