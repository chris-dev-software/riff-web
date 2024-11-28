"use server";

import { ScheduleUSER } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function useGetUserSchedules(): Promise<ScheduleUSER[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${API_URL}/schedules/my-schedules`, {
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

function formatScheduleData(schedules: any[]): ScheduleUSER[] {
  return schedules.map((schedule) => ({
    id: Number(schedule?.id),
    weekday: schedule?.weekday,
    start_time: schedule?.start_time,
    end_time: schedule?.end_time,
    created_at: format(new Date(schedule.created_at), "dd/MM/yyyy", {
      locale: es,
    }),
  }));
}
