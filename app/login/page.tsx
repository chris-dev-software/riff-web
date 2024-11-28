"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import {
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  dni: z
    .string({ required_error: "DNI obligatorio" })
    .length(8, { message: "El DNI debe tener 8 digitos" })
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" }),
  password: z
    .string({ required_error: "Contraseña obligatoria" })
    .min(8, { message: "Contraseña minima de 8 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { dni: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");

    try {
      const role = await login(data.dni, data.password);

      // Redirigir según el rol del usuario
      if (role === "USER") {
        router.push("/dashboard/user");
      } else if (role === "ADMIN") {
        router.push("/dashboard/admin");
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <Input placeholder="Ingresa tu DNI" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="default" className="w-full">
              Ingresar
            </Button>

            {error && <p className="text-center text-red-600 mt-2">{error}</p>}
          </form>
        </Form>
      </div>
    </main>
  );
}
