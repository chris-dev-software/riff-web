"use client";

import {
  FC,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

interface DialogContextProps {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

interface DialogProviderProps extends PropsWithChildren {}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog debe usarse dentro de un DialogProvider");
  }
  return context;
};
