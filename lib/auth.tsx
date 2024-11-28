// lib/auth.ts
export async function login(dni: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dni, password }),
  });

  if (!res.ok) {
    throw new Error("Error en el inicio de sesión");
  }

  const { token, role } = await res.json();
  document.cookie = `token=${token}; path=/`; // Guardamos el token en cookies

  return role; // Retornamos el rol para usarlo en la redirección
}

// lib/auth.ts
export function logout() {
  document.cookie = "token=; Max-Age=0; path=/"; // Eliminamos el token
}
