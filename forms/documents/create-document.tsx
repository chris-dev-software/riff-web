"use client";

import { FC, useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { SimpleUser } from "@/types";
import { useDialog } from "@/contexts";
import { useRouter } from "next/navigation";

const currentYear = new Date().getFullYear();

interface DocumentFormValues {
  user_id: number;
  type: "REMUNERACION" | "GRATIFICACION";
  month: string;
  year: string; // Actualizamos a string para manejar los valores del Select
  document: File | null;
}

const schema = z.object({
  user_id: z.number({ required_error: "El ID del usuario es obligatorio" }),
  type: z.enum(["REMUNERACION", "GRATIFICACION"], {
    required_error: "Debe seleccionar un tipo de documento",
  }),
  month: z.enum(
    [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ],
    { required_error: "Debe seleccionar un mes" }
  ),
  year: z
    .string({ required_error: "El año es obligatorio" })
    .refine((val) => !isNaN(Number(val)), {
      message: "El año debe ser válido",
    }),
  document: z
    .instanceof(File, { message: "Debe seleccionar un archivo PDF" })
    .nullable()
    .refine((file) => file?.type === "application/pdf", {
      message: "El archivo debe ser un PDF",
    }),
});

function formatSimpleUsers(users: any[]): SimpleUser[] {
  return users.map((user) => ({
    id: Number(user?.id),
    label: `${user?.name} ${user?.last_name}`,
  }));
}

export const CreateDocument: FC = () => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>("");
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const { closeDialog } = useDialog();
  const router = useRouter();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: currentYear.toString(),
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/basic-info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data: any = await res.json();

        const mappedSimpleUsers = formatSimpleUsers(data);

        setUsers(mappedSimpleUsers);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al cargar los usuarios.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (values: DocumentFormValues) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const formData = new FormData();
      formData.append("user_id", values.user_id.toString());
      formData.append("type", values.type);
      formData.append("month", values.month);
      formData.append("year", values.year);
      formData.append("document", values.document as File);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Error al enviar el documento");
      }

      toast({
        title: "Éxito",
        description: "Documento enviado correctamente.",
        variant: "default",
      });

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error al enviar el documento:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el documento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                  disabled={loadingUsers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMUNERACION">Remuneración</SelectItem>
                    <SelectItem value="GRATIFICACION">Gratificación</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mes */}
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mes</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "ENERO",
                      "FEBRERO",
                      "MARZO",
                      "ABRIL",
                      "MAYO",
                      "JUNIO",
                      "JULIO",
                      "AGOSTO",
                      "SETIEMBRE",
                      "OCTUBRE",
                      "NOVIEMBRE",
                      "DICIEMBRE",
                    ].map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Año */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={(currentYear - 1).toString()}>
                      {currentYear - 1}
                    </SelectItem>
                    <SelectItem value={currentYear.toString()}>
                      {currentYear}
                    </SelectItem>
                    <SelectItem value={(currentYear + 1).toString()}>
                      {currentYear + 1}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documento (PDF) */}
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento (PDF)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    setFileName(file ? file.name : "");
                  }}
                />
              </FormControl>
              <p className="mt-2 text-sm text-gray-500">
                {fileName || "No se seleccionó ningún archivo"}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Enviando..." : "Enviar Documento"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateDocument;
