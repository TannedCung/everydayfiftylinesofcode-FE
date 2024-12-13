export type SnackbarMessage = string;

export interface SnackbarOptions {
  duration?: number; // Duration in milliseconds
  status?: SnackbarStatus; // Status of the Snackbar
}

export type SnackbarStatus = 'success' | 'error' | 'info' | 'warning';