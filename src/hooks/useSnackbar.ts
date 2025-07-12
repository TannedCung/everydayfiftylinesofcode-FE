import React, { createContext } from "react";
import { SnackbarStatus } from "../types/snackbar";

interface SnackbarContextType {
  showSnackbar: (options: { message: string; status: SnackbarStatus }) => void;
  hideSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  const { showSnackbar } = context;

  const triggerSnackbar = (message: string, status: SnackbarStatus) => {
    showSnackbar({ message, status });
  };

  return { triggerSnackbar };
};