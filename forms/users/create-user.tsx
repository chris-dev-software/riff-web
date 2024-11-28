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
import { useCreateUser, useToast } from "@/hooks";
import { useDialog } from "@/contexts";
import { useRouter } from "next/navigation";
import { AddUserFormValues } from "@/types";

interface CreateUserProps {}

const createUserSchema = z.object({
  dni: z
    .string({ required_error: "Campo Obligatorio" })
    .min(1, "Campo Obligatorio")
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" })
    .length(8, { message: "El DNI debe tener 8 dígitos" }),
  name: z
    .string({ required_error: "Campo Obligatorio" })
    .min(1, "Campo Obligatorio")
    .min(3, "El nombre debe tener minimo 3 caracteres"),
  last_name: z
    .string({ required_error: "Apellidos obligatorios" })
    .min(1, "Campo Obligatorio")
    .min(3, "El apellido debe tener minimo 3 caracteres"),
  phone: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || /^\d+$/.test(val), {
      message: "El teléfono solo debe contener números",
    })
    .refine((val) => val === undefined || val === "" || val.length === 9, {
      message: "El teléfono debe tener exactamente 9 dígitos",
    }),
  salary: z
    .string({ required_error: "Campo Obligatorio" })
    .min(1, { message: "Campo Obligatorio" })
    .refine((val) => !isNaN(Number(val)), {
      message: "El salario debe ser un número",
    })
    .refine((val) => Number(val) > 0, {
      message: "El salario debe ser positivo",
    })
    .refine((val) => val.length >= 3, {
      message: "El salario debe tener al menos 3 caracteres",
    }),
  address: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || val.length >= 3, {
      message: "La dirección debe tener al menos 3 caracteres",
    }),
  password: z
    .string({ required_error: "Contraseña obligatoria" })
    .min(8, { message: "Contraseña mínima de 8 caracteres" }),
});

export const CreateUser: FC<CreateUserProps> = () => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const router = useRouter();
  const [createUser, loadingCreate, errorCreate] = useCreateUser();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      dni: "",
      name: "",
      address: "",
      last_name: "",
      password: "",
      phone: "",
      salary: "",
    },
  });

  const onSubmit = async (values: AddUserFormValues) => {
    await createUser(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
      >
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input placeholder="Apellidos..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salario</FormLabel>
              <FormControl>
                <Input placeholder="Salario..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input placeholder="Telefono..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direccion</FormLabel>
              <FormControl>
                <Input placeholder="Direccion..." {...field} />
              </FormControl>
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
              <FormControl>
                <Input type="password" placeholder="Contraseña..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loadingCreate} type="submit">
          {loadingCreate ? "Creando Usuario" : "Crear Usuario"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUser;
