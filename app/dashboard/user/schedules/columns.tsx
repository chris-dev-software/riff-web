"use client";

import { ScheduleUSER } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ScheduleUSER>[] = [
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
];
