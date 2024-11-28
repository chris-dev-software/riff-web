"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      {/* Filtros */}
      <div className="flex justify-end mb-4 gap-4">
        {/* Filtro por DNI */}
        <Input
          placeholder="Filtrar por DNI"
          value={(table.getColumn("dni")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("dni")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />

        {/* Filtro por Tipo */}
        <Select
          onValueChange={(value) =>
            table
              .getColumn("type")
              ?.setFilterValue(value === "NINGUNA" ? "" : value)
          }
          defaultValue="NINGUNA"
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NINGUNA">Todos</SelectItem>
            <SelectItem value="REMUNERACION">Remuneración</SelectItem>
            <SelectItem value="GRATIFICACION">Gratificación</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Mes */}
        <Select
          onValueChange={(value) =>
            table
              .getColumn("month")
              ?.setFilterValue(value === "NINGUNA" ? "" : value)
          }
          defaultValue="NINGUNA"
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filtrar por mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NINGUNA">Todos</SelectItem>
            <SelectItem value="ENERO">Enero</SelectItem>
            <SelectItem value="FEBRERO">Febrero</SelectItem>
            <SelectItem value="MARZO">Marzo</SelectItem>
            <SelectItem value="ABRIL">Abril</SelectItem>
            <SelectItem value="MAYO">Mayo</SelectItem>
            <SelectItem value="JUNIO">Junio</SelectItem>
            <SelectItem value="JULIO">Julio</SelectItem>
            <SelectItem value="AGOSTO">Agosto</SelectItem>
            <SelectItem value="SEPTIEMBRE">Septiembre</SelectItem>
            <SelectItem value="OCTUBRE">Octubre</SelectItem>
            <SelectItem value="NOVIEMBRE">Noviembre</SelectItem>
            <SelectItem value="DICIEMBRE">Diciembre</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Año */}
        <Select
          onValueChange={(value) =>
            table
              .getColumn("year")
              ?.setFilterValue(value === "NINGUNA" ? "" : value)
          }
          defaultValue="NINGUNA"
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filtrar por año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NINGUNA">Todos</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-center truncate" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center truncate" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
