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
import { useDialog } from "@/contexts";
import { UserRoundPenIcon } from "lucide-react";
import { EditUser as EditUserForm } from "@/forms";

interface EditUserProps {
  userID: number;
}

export const EditUser: FC<EditUserProps> = ({ userID }) => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogTrigger asChild onClick={openDialog}>
        <Button variant={"ghost"} className="w-full justify-start px-2">
          <UserRoundPenIcon />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Editar</DialogTitle>
          <DialogDescription className="text-center">
            Apartado para editar un usuario
          </DialogDescription>
          <EditUserForm userID={userID} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
