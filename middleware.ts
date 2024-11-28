import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Verificar si el usuario está accediendo a la página de login
  if (req.nextUrl.pathname === "/login") {
    if (token) {
      try {
        // Verificar el token JWT
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Redirigir al dashboard correspondiente según el rol
        if (payload.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        } else if (payload.role === "USER") {
          return NextResponse.redirect(new URL("/dashboard/user", req.url));
        }
      } catch (error) {
        console.log("Token inválido, permitiendo acceso al login:", error);
      }
    }
    return NextResponse.next(); // Permitir el acceso a /login si no hay token
  }

  // Verificar si el usuario está accediendo a una ruta protegida sin un token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verificar el token JWT en rutas protegidas
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Comprobación del rol del usuario para la ruta /dashboard/user
    if (req.nextUrl.pathname.startsWith("/dashboard/user")) {
      if (payload.role !== "USER") {
        // Redirigir a /dashboard/user si el rol no es adecuado
        return NextResponse.redirect(new URL("/dashboard/user", req.url));
      }
    }

    // Comprobación del rol del usuario para la ruta /dashboard/admin
    if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
      if (payload.role !== "ADMIN") {
        // Redirigir a /dashboard/admin si el rol no es adecuado
        return NextResponse.redirect(new URL("/dashboard/user", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Token inválido en rutas protegidas:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configurar en qué rutas se aplica el middleware
export const config = {
  matcher: ["/login", "/dashboard/user/:path*", "/dashboard/admin/:path*"],
};
