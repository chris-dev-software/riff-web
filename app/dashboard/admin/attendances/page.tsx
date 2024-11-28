import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { cookies } from "next/headers";
import Loading from "./loading";
import { Attendance } from "@/types";
import { DialogProvider, SheetProvider } from "@/contexts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AddAttendance, LoadAttendances } from "@/components/attendances";

async function getData(): Promise<any[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendances`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener las asistencias");
    }

    const data: any = await res.json();

    return formatAttendanceData(data);
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }
}

function formatAttendanceData(attendances: any[]): Attendance[] {
  return attendances.map((attendance) => {
    const [day, month, year] = attendance?.date.split("/");
    return {
      id: Number(attendance?.id),
      dni: attendance?.user?.dni,
      name: attendance?.user?.name,
      last_name: attendance?.user?.last_name,
      user_id: attendance?.user?.id,
      date: attendance?.date,
      month,
      year,
      time_entry: attendance?.time_entry,
      time_departure: attendance?.time_departure,
      state: attendance?.state,
      created_at: format(new Date(attendance.created_at), "dd/MM/yyyy"),
    };
  });
}

export default async function AttendancesPage() {
  const data = await getData();

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Asistencias</h1>
        <div className="flex items-center gap-5">
          <DialogProvider>
            <AddAttendance />
          </DialogProvider>
          <SheetProvider>
            <LoadAttendances />
          </SheetProvider>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}
