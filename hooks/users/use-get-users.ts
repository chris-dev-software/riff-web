"use server";

import { cookies } from "next/headers";
import { UserResponse, User } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function useGetUsers(): Promise<User[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    const data: UserResponse[] = await res.json();

    return formatUserData(data);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return [];
  }
}

function formatUserData(users: UserResponse[]): User[] {
  return users.map((user) => ({
    ...user,
    status: user.status === "ACTIVE" ? "Activo" : "Inactivo",
    role: user.role === "USER" ? "Usuario" : "Administrador",
    updated_at: format(new Date(user.updated_at), "dd/MM/yyyy", { locale: es }),
    address: user.address || "--",
    phone: user.phone || "--",
    salary: String(user.salary),
  }));
}
