"use client";

import { useState } from "react";
import { useToast } from "../use-toast"; // Asegúrate de tener configurado el hook de `toast`
import { useRouter } from "next/navigation";

export const useDeleteDocument = (): [
  (documentId: number) => Promise<void>,
  boolean
] => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const deleteDocument = async (documentId: number) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al eliminar el documento.");
      }

      toast({
        title: "Documento Eliminado",
        description: "El documento se ha eliminado exitosamente.",
        variant: "default",
      });

      router.refresh();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);

      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el documento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return [deleteDocument, loading];
};
