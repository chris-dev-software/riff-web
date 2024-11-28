"use server";

import { UserProfile } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cookies } from "next/headers";

export async function useGetUserProfile(): Promise<UserProfile | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/my-profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el perfil del usuario");
    }

    const user: any = await res.json();

    return {
      ...user,
      created_at: format(new Date(user.created_at), "dd/MM/yyyy", {
        locale: es,
      }),
      updated_at: format(new Date(user.updated_at), "dd/MM/yyyy", {
        locale: es,
      }),
    };
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return null;
  }
}
