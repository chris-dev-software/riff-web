import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { cookies } from "next/headers";
import Loading from "./loading";
import { AttendanceUSER } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getData(): Promise<AttendanceUSER[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attendances/my-attendances`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

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

function formatAttendanceData(attendances: any[]): AttendanceUSER[] {
  return attendances.map((attendance) => ({
    id: Number(attendance?.id),
    date: attendance?.date,
    time_entry: attendance?.time_entry,
    time_departure: attendance?.time_departure,
    state: attendance?.state,
    created_at: format(new Date(attendance.created_at), "dd/MM/yyyy", {
      locale: es,
    }),
  }));
}

export default async function AttendancesPage() {
  const data = await getData();

  const currentMonth = format(new Date(), "MMMM", { locale: es });

  return (
    <div className="p-5 grid grid-rows-[auto_1fr] gap-5">
      <div>
        <h1 className="text-3xl font-semibold">
          Asistencias del mes{" "}
          {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
        </h1>
        <p className="text-base text-secondary">
          Aqui podras visualizar todos tus asistencias del mes actual
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}
