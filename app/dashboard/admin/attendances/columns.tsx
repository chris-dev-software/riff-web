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
import { useDeleteAttendance } from "@/hooks";
import { Attendance } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
export const columns: ColumnDef<Attendance>[] = [
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
    accessorKey: "date",
    header: "Día",
  },
  {
    accessorKey: "month",
    header: "Mes",
    enableHiding: true,
  },
  {
    accessorKey: "year",
    header: "Año",
    enableHiding: true,
  },
  {
    accessorKey: "time_entry",
    header: "Hora de Entrada",
  },
  {
    accessorKey: "time_departure",
    header: "Hora de Salida",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "created_at",
    header: "Creación",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [deleteAttendance, loading] = useDeleteAttendance();

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
                    ¿Estas seguro que deseas eliminar esta asistencia?
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
                    onClick={() => deleteAttendance(id)}
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
