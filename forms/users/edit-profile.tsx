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
import { useProfile } from "@/contexts";
import { useRouter } from "next/navigation";

const schema = z.object({
  dni: z
    .string({ required_error: "Campo Obligatorio" })
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" })
    .length(8, { message: "El DNI debe tener 8 dígitos" }),
  name: z
    .string({ required_error: "Campo Obligatorio" })
    .min(3, "El nombre debe tener mínimo 3 caracteres"),
  last_name: z
    .string({ required_error: "Apellidos obligatorios" })
    .min(3, "El apellido debe tener mínimo 3 caracteres"),
  address: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || val.length >= 3, {
      message: "La dirección debe tener al menos 3 caracteres",
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || /^\d+$/.test(val), {
      message: "El teléfono solo debe contener números",
    })
    .refine((val) => val === undefined || val === "" || val.length === 9, {
      message: "El teléfono debe tener exactamente 9 dígitos",
    }),
});

type EditProfileFormValues = z.infer<typeof schema>;

export const EditProfile: FC = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dni: profile.dni,
      name: profile.name,
      last_name: profile.last_name,
      address: profile.address,
      phone: profile.phone,
    },
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Token de autenticación no encontrado.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil.");
      }

      router.refresh();

      toast({
        title: "Perfil actualizado",
        description: "Los datos del perfil se han actualizado correctamente.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el perfil.",
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
        {/* DNI (Solo lectura) */}
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el DNI"
                  {...field}
                  readOnly // Esto asegura que el campo no sea editable
                  className="cursor-not-allowed bg-gray-100" // Estiliza el campo para indicar que es solo lectura
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Apellido */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dirección */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese la dirección" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 self-start">
          Guardar cambios
        </Button>
      </form>
    </Form>
  );
};

export default EditProfile;
