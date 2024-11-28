"use client";

import { useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";

export const useDeleteSchedule = (): [
  (scheduleId: number) => Promise<void>,
  boolean
] => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const deleteSchedule = async (scheduleId: number) => {
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al eliminar el horario.");
      }

      toast({
        title: "Horario Eliminado",
        description: "El horario se ha eliminado exitosamente.",
        variant: "default",
      });

      router.refresh();
    } catch (error) {
      console.error("Error al eliminar el horario:", error);

      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el horario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return [deleteSchedule, loading];
};
