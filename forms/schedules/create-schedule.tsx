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
import { AddScheduleFormValues, SimpleUser } from "@/types";
import { TimePickerDemo } from "@/components/riff";
import { useCreateSchedule } from "@/hooks";

const schema = z
  .object({
    weekday: z.enum(
      [
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO",
        "DOMINGO",
      ],
      { required_error: "El día es obligatorio" }
    ),
    start_time: z.date({ required_error: "La hora de inicio es obligatoria" }),
    end_time: z.date({ required_error: "La hora de fin es obligatoria" }),
    user_id: z.number({ required_error: "El ID del usuario es obligatorio" }),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["end_time"],
  });

function formatSimpleUsers(users: any[]): SimpleUser[] {
  return users.map((user) => ({
    id: Number(user?.id),
    label: `${user?.name} ${user?.last_name}`,
  }));
}

export const CreateSchedule: FC = () => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  const [createSchedule, loadingCreate, errorCreate] = useCreateSchedule();

  const { toast } = useToast();

  const form = useForm<AddScheduleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      weekday: "LUNES",
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

  const onSubmit = async (values: AddScheduleFormValues) => {
    await createSchedule(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
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
          name="weekday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Día de la semana</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un día" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUNES">Lunes</SelectItem>
                    <SelectItem value="MARTES">Martes</SelectItem>
                    <SelectItem value="MIERCOLES">Miércoles</SelectItem>
                    <SelectItem value="JUEVES">Jueves</SelectItem>
                    <SelectItem value="VIERNES">Viernes</SelectItem>
                    <SelectItem value="SABADO">Sábado</SelectItem>
                    <SelectItem value="DOMINGO">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de inicio</FormLabel>
              <FormControl>
                <TimePickerDemo date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de fin</FormLabel>
              <FormControl>
                <TimePickerDemo date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loadingCreate} type="submit">
          {loadingCreate ? "Creando Horario" : "Crear Horario"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateSchedule;
