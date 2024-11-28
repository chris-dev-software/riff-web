import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Loading from "./loading";
import { useGetUserSchedules } from "@/hooks";

export default async function SchedulesPage() {
  const data = await useGetUserSchedules();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5">
      <div>
        <h1 className="text-3xl font-medium">Horarios</h1>
        <p className="text-secondary text-base">
          Aqui podras visualizar todos los horarios que se te asignaron
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}
