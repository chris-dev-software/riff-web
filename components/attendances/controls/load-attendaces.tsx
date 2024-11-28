"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { FC, useState } from "react";
import { useSheet } from "@/contexts";
import { cn } from "@/lib/utils";
import { ExcelIcon } from "@/components/riff";
import * as XLSX from "xlsx";
import { useAddBulkAttendances } from "@/hooks";

interface Attendance {
  dni: string;
  name: string;
  last_name: string;
  date: string;
  time_entry: string;
  time_departure: string;
}

interface LoadAttendancesProps {}

export const LoadAttendances: FC<LoadAttendancesProps> = () => {
  const { isSheetOpen, openSheet, closeSheet } = useSheet();
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const [addBulkAttendances, loading, error] = useAddBulkAttendances();

  const handleFileUpload = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const data: Attendance[] = jsonData.slice(1).map((row) => ({
        dni: row[0] || "",
        name: row[1] || "",
        last_name: row[2] || "",
        date: row[3] || "",
        time_entry: row[4] || "",
        time_departure: row[5] || "",
      }));

      setAttendances(data);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
    }
  };

  const handleImport = async () => {
    const response = await addBulkAttendances(attendances);
    if (response) {
      alert(
        `Asistencias importadas: ${response.added.length}, Omitidas: ${response.skipped.length}`
      );
      setAttendances([]); // Limpiar la lista tras importar
    }
  };

  const handleClear = () => {
    setAttendances([]);
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => (open ? openSheet() : closeSheet())}
    >
      <SheetTrigger asChild>
        <Button size="lg">Cargar Asistencias</Button>
      </SheetTrigger>
      <SheetContent className="grid grid-rows-[auto_1fr] w-[600px] max-w-full mx-auto">
        <SheetHeader>
          <SheetTitle>Asistencias</SheetTitle>
          <SheetDescription>
            Aquí puedes cargar o visualizar las asistencias previas a registrar.
          </SheetDescription>
        </SheetHeader>

        {attendances.length <= 0 ? (
          <label
            htmlFor="dropzone-file"
            className={cn(
              "flex flex-col items-center justify-center gap-4",
              "rounded-xl border-2 border-dashed border-neutral-400",
              "cursor-pointer"
            )}
          >
            <ExcelIcon className="size-10 text-neutral-400" />
            <p className="text-lg text-neutral-400">Subir archivo Excel</p>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
          </label>
        ) : (
          <div className="grid grid-rows-[1fr_auto] gap-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DNI</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead className="text-center">Dia</TableHead>
                  <TableHead className="text-center">Entrada</TableHead>
                  <TableHead className="text-center">Salida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="truncate">{item.dni}</TableCell>
                    <TableCell className="truncate">{item.name}</TableCell>
                    <TableCell className="truncate">{item.last_name}</TableCell>
                    <TableCell className="truncate text-center">
                      {item.date}
                    </TableCell>
                    <TableCell className="truncate text-center">
                      {item.time_entry}
                    </TableCell>
                    <TableCell className="truncate text-center">
                      {item.time_departure}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end gap-5 items-center">
              <Button
                onClick={handleImport}
                disabled={loading}
                className="bg-primary text-white"
              >
                {loading ? "Importando..." : "Importar"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={loading}
              >
                Limpiar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default LoadAttendances;
