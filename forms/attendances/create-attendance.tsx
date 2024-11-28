"use client";

import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { useDialog } from "@/contexts";
import { useRouter } from "next/navigation";
import { AddAttendanceFormValues, SimpleUser } from "@/types";
import { TimePickerDemo } from "@/components/riff";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";

const schema = z
  .object({
    state: z.enum(["PRESENTE", "AUSENTE", "TARDE", "JUSTIFICADO"], {
      required_error: "El estado es obligatorio",
    }),
    date: z.date({ required_error: "La fecha es obligatoria" }),
    time_entry: z.date({ required_error: "La hora de inicio es obligatoria" }),
    time_departure: z.date({ required_error: "La hora de fin es obligatoria" }),
    user_id: z.number({ required_error: "El ID del usuario es obligatorio" }),
  })
  .refine((data) => data.time_departure > data.time_entry, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["time_departure"],
  });

function formatSimpleUsers(users: any[]): SimpleUser[] {
  return users.map((user) => ({
    id: Number(user?.id),
    label: `${user?.name} ${user?.last_name}`,
  }));
}

export const CreateAttendance: FC = () => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const router = useRouter();

  const form = useForm<AddAttendanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
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

  const onSubmit = async (values: AddAttendanceFormValues) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const payload = {
        state: values.state,
        date: format(values.date, "dd/MM/yyyy"),
        time_entry: format(values.time_entry, "HH:mm"),
        time_departure: format(values.time_departure, "HH:mm"),
        user_id: values.user_id,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Error al crear la asistencia");
      }

      toast({
        title: "Asistencia creada",
        description: "La asistencia se ha creado exitosamente.",
        variant: "default",
      });

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error al crear la asistencia:", error);

      toast({
        title: "Error",
        description: "Hubo un problema al crear la asistencia.",
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
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_entry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de entrada</FormLabel>
              <FormControl>
                <TimePickerDemo date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de salida</FormLabel>
              <FormControl>
                <TimePickerDemo date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENTE">Presente</SelectItem>
                    <SelectItem value="AUSENTE">Ausente</SelectItem>
                    <SelectItem value="TARDE">Tarde</SelectItem>
                    <SelectItem value="JUSTIFICADO">Justificado</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit">Crear Asistencia</Button>
      </form>
    </Form>
  );
};

export default CreateAttendance;
