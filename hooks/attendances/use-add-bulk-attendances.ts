"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Attendance {
  dni: string;
  date: string;
  time_entry: string;
  time_departure: string;
}

interface AddBulkAttendancesResponse {
  added: Array<{ dni: string; date: string }>;
  skipped: Array<{ dni: string; date: string; error: string }>;
}

export const useAddBulkAttendances = (): [
  (attendances: Attendance[]) => Promise<AddBulkAttendancesResponse | null>,
  boolean,
  string | null
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addBulkAttendances = async (
    attendances: Attendance[]
  ): Promise<AddBulkAttendancesResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(attendances),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al agregar asistencias: ${response.statusText}`);
      }

      const data: AddBulkAttendancesResponse = await response.json();
      setLoading(false);
      router.refresh();
      return data;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setLoading(false);
      return null;
    }
  };

  return [addBulkAttendances, loading, error];
};
