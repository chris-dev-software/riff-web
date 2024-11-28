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
import { CreateSchedule } from "@/forms";
import { useDialog } from "@/contexts";

interface AddScheduleProps {}

export const AddSchedule: FC<AddScheduleProps> = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (open ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>
        <Button size="lg">Nuevo Horario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Horarios</DialogTitle>
          <DialogDescription className="text-center">
            Apartado para crear horarios
          </DialogDescription>
          <CreateSchedule />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchedule;
