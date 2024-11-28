"use client";

import { AttendanceUSER } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<AttendanceUSER>[] = [
  {
    accessorKey: "date",
    header: "Día",
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
];
