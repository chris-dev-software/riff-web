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
import { CreateDocument } from "@/forms";

interface AddDocumentProps {}

export const AddDocument: FC<AddDocumentProps> = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => (open ? openDialog() : closeDialog())}
    >
      <DialogTrigger asChild>
        <Button size="lg">Nuevo Documento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Documentos</DialogTitle>
          <DialogDescription className="text-center">
            Apartado para subir documentos
          </DialogDescription>
          <CreateDocument />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocument;
