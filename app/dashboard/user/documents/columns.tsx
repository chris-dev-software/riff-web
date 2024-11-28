"use client";

import { DocumentUSER } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<DocumentUSER>[] = [
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
];
