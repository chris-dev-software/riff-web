export type UserResponse = {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  salary: number;
  address: string;
  phone: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  salary: string;
  address: string;
  phone: string;
  role: "Usuario" | "Administrador";
  status: "Activo" | "Inactivo";
  updated_at: string;
};

export interface ResponseUserEdit {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  salary: string;
  address: string;
  phone: string;
}

export type SimpleUser = {
  id: number;
  label: string;
};

interface UserProfile {
  id: number;
  dni: string;
  name: string;
  last_name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export type AddUserFormValues = {
  name: string;
  dni: string;
  last_name: string;
  salary: string;
  password: string;
  address?: string;
  phone?: string;
};
