export interface SnackbarGroupProps {
  txnAddress: string;
  snackbar: boolean;
  closeSnackbar: () => void;
  txnAddress: string;
  error: string;
  loading: boolean;
  loadingMessage: string;
}
