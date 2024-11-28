"use client";

import { FC } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { CreateUser } from "@/forms";
import { useDialog } from "@/contexts";

interface AddUserProps {}

export const AddUser: FC<AddUserProps> = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (open ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>
        <Button size="lg">Nuevo Usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Usuarios</DialogTitle>
          <DialogDescription className="text-center">
            Apartado para crear usuarios
          </DialogDescription>
          <CreateUser />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
