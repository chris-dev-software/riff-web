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
import { useDeleteDocument } from "@/hooks";
import { Document } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Document>[] = [
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
    accessorKey: "type",
    header: "Tipo de Documento",
  },
  {
    accessorKey: "month",
    header: "Mes",
  },
  {
    accessorKey: "year",
    header: "Año",
  },
  {
    accessorKey: "url",
    header: "Documento",
    cell: ({ row }) => {
      const { url } = row.original;
      return (
        <Link href={url} target="_blank">
          <ExternalLinkIcon className="inline w-5 h-5" />
        </Link>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Creación",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [deleteDocument, loading] = useDeleteDocument();

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
                    ¿Estas seguro que deseas eliminar este documento?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esto implicara eliminar el documento de manera permanente
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={loading}
                    onClick={() => deleteDocument(id)}
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
