"use client";

import { useState } from "react";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { AddScheduleFormValues } from "@/types";
import { useDialog } from "@/contexts";

type UseCreateScheduleReturn = [
  (values: AddScheduleFormValues) => Promise<void>,
  boolean,
  string | null
];

export const useCreateSchedule = (): UseCreateScheduleReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { closeDialog } = useDialog();

  const createSchedule = async (values: AddScheduleFormValues) => {
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

      const payload = {
        weekday: values.weekday,
        start_time: format(values.start_time, "HH:mm"),
        end_time: format(values.end_time, "HH:mm"),
        user_id: values.user_id,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al crear el horario");
      }

      toast({
        title: "Horario creado",
        description: "El horario se ha creado exitosamente.",
        variant: "default",
      });

      closeDialog();
      router.refresh();
    } catch (err: any) {
      console.error("Error al crear el horario:", err);
      setError(err.message || "Hubo un problema al crear el horario.");

      toast({
        title: "Error",
        description: err.message || "Hubo un problema al crear el horario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return [createSchedule, loading, error];
};
