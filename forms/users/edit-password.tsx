"use client";

import { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string({
      required_error: "Debe confirmar su contraseña",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type ChangePasswordFormValues = z.infer<typeof schema>;

export const EditPassword: FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Token de autenticación no encontrado.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: values.password }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la contraseña");
      }

      toast({
        title: "Contraseña actualizada",
        description: "Su contraseña ha sido actualizada correctamente.",
        variant: "default",
      });

      router.refresh();
      form.reset();
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la contraseña.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Ingrese su nueva contraseña"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmar Contraseña */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirme su nueva contraseña"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 self-start">
          Actualizar Contraseña
        </Button>
      </form>
    </Form>
  );
};

export default EditPassword;
