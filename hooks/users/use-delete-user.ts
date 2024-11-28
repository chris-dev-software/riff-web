"use client";

import { useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";

export const useDeleteUser = (): [
  (userID: number) => Promise<void>,
  boolean
] => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const deleteUser = async (userId: number) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      toast({
        title: "Usuario Eliminado",
        description: "El usuario se ha eliminado exitosamente.",
        variant: "default",
      });

      router.refresh();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return [deleteUser, loading];
};
