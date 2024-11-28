"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    month: false,
    year: false,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Filtros */}
      <div className="flex justify-end mb-4 gap-4">
        <Input
          placeholder="Filtrar por DNI"
          value={(table.getColumn("dni")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("dni")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />

        <Input
          placeholder="Filtrar por Nombre"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />

        <Select
          onValueChange={(value) =>
            table
              .getColumn("month")
              ?.setFilterValue(value === "NINGUNO" ? "" : value)
          }
          defaultValue="NINGUNO"
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filtrar por Mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NINGUNO">Todos</SelectItem>
            <SelectItem value="01">Enero</SelectItem>
            <SelectItem value="02">Febrero</SelectItem>
            <SelectItem value="03">Marzo</SelectItem>
            <SelectItem value="04">Abril</SelectItem>
            <SelectItem value="05">Mayo</SelectItem>
            <SelectItem value="06">Junio</SelectItem>
            <SelectItem value="07">Julio</SelectItem>
            <SelectItem value="08">Agosto</SelectItem>
            <SelectItem value="09">Septiembre</SelectItem>
            <SelectItem value="10">Octubre</SelectItem>
            <SelectItem value="11">Noviembre</SelectItem>
            <SelectItem value="12">Diciembre</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            table
              .getColumn("year")
              ?.setFilterValue(value === "NINGUNO" ? "" : value)
          }
          defaultValue="NINGUNO"
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filtrar por Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NINGUNO">Todos</SelectItem>
            <SelectItem value={currentYear.toString()}>
              {currentYear}
            </SelectItem>
            <SelectItem value={(currentYear - 1).toString()}>
              {currentYear - 1}
            </SelectItem>
            <SelectItem value={(currentYear + 1).toString()}>
              {currentYear + 1}
            </SelectItem>
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
