"use server";

import { cookies } from "next/headers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Schedule } from "@/types";

export async function useGetSchedules(): Promise<Schedule[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los horarios");
    }

    const data: any = await res.json();

    return formatScheduleData(data);
  } catch (error) {
    console.error("Error al obtener los horarios:", error);
    return [];
  }
}

function formatScheduleData(schedules: any[]): Schedule[] {
  return schedules.map((schedule) => ({
    id: Number(schedule?.id),
    dni: schedule?.user?.dni,
    name: schedule?.user?.name,
    last_name: schedule?.user?.last_name,
    user_id: schedule?.user?.id,
    weekday: schedule?.weekday,
    start_time: schedule?.start_time,
    end_time: schedule?.end_time,
    created_at: format(new Date(schedule.created_at), "dd/MM/yyyy", {
      locale: es,
    }),
  }));
}