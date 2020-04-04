import React, { ReactElement } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { SnackbarProps } from "./types";

const SnackbarComponent = (props: SnackbarProps): ReactElement => {
  const { snackbar, closeSnackbar, type, children } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={snackbar}
      autoHideDuration={5000}
      onClose={closeSnackbar}
    >
      <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={type}>
        {children}
      </MuiAlert>
    </Snackbar>
  );
};
export default SnackbarComponent;
