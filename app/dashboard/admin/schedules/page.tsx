import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Loading from "./loading";
import { DialogProvider } from "@/contexts";
import { AddSchedule } from "@/components/schedules";
import { useGetSchedules } from "@/hooks";

export default async function SchedulesPage() {
  const data = await useGetSchedules();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">Horarios</h1>
          <p className="text-secondary text-base">
            Aqui podras visualizar los horarios asi como crearlas
            individualemente
          </p>
        </div>
        <DialogProvider>
          <AddSchedule />
        </DialogProvider>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}
