"use client";

import { useState } from "react";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";
import { AddUserFormValues } from "@/types";
import { useDialog } from "@/contexts";

export const useCreateUser = (): [
  (values: AddUserFormValues) => Promise<void>,
  boolean,
  string | null
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { closeDialog } = useDialog();

  const createUser = async (userData: AddUserFormValues) => {
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Error al crear el usuario");
      }

      toast({
        title: "Usuario creado",
        description: "El usuario se ha creado exitosamente.",
        variant: "default",
      });

      closeDialog();
      router.refresh();
    } catch (err: any) {
      console.error("Error al crear el usuario:", err);
      setError(err.message || "Error desconocido");
      toast({
        title: "Error",
        description: "Hubo un problema al crear el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return [createUser, loading, error];
};
