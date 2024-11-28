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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useDeleteSchedule } from "@/hooks";
import { Schedule } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export const columns: ColumnDef<Schedule>[] = [
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
    accessorKey: "weekday",
    header: "Día",
  },
  {
    accessorKey: "start_time",
    header: "Hora de Entrada",
  },
  {
    accessorKey: "end_time",
    header: "Hora de Salida",
  },
  {
    accessorKey: "created_at",
    header: "Creación",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [deleteSchedule, loading] = useDeleteSchedule();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-accent rounded-lg">
            <MoreHorizontalIcon className="size-6 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opciones</DropdownMenuLabel>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={loading}
                  variant={"ghost"}
                  className="w-full justify-start px-2"
                >
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estas seguro que deseas eliminar este horario?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esto implicara eliminar el registro permanentemente
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={loading}
                    onClick={() => deleteSchedule(id)}
                  >
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
