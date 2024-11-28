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
import { CreateAttendance } from "@/forms/attendances";

interface AddAttendanceProps {}

export const AddAttendance: FC<AddAttendanceProps> = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (open ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>
        <Button size="lg">Nueva Asistencia</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            Asistencias
          </DialogTitle>
          <DialogDescription className="text-center">
            Apartado para cargar asistencias
          </DialogDescription>
          <CreateAttendance />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendance;
