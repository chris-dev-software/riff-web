"use client";

import {
  FC,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

interface SheetContextProps {
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

interface SheetProviderProps extends PropsWithChildren {}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export const SheetProvider: FC<SheetProviderProps> = ({ children }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <SheetContext.Provider value={{ isSheetOpen, openSheet, closeSheet }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet debe usarse dentro de un SheetProvider");
  }
  return context;
};
