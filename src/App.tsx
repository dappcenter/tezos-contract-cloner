import React, { useState } from "react";
import { Tezos } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./Provider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnMsg, setTxnMsg] = useState("");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const onSubmit = (data: any): any => {
    const txn = Tezos.contract
      .transfer({ to: data.address, amount: parseInt(data.amount) })
      .then(op => {
        op.confirmation();
      })
      .then(block => setTxnMsg(`Block height: ${block}`))
      .catch(error => setError(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    return txn;
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };

  return (
    <div>
      <Provider />
      <div id="wallet">
        <h1>Carthagenet Transaction Tool</h1>
        {txnMsg && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
              {txnMsg}
            </MuiAlert>
          </Snackbar>
        )}
        {error && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="warning">
              {error}
            </MuiAlert>
          </Snackbar>
        )}
        <div id="dialog">
          <div id="content">
            <div id="balance-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Receiving Address" id="address-input" name="address" ref={register} />
                <br />
                <input placeholder="Amount of Tezos" id="address-input" type="number" name="amount" ref={register} />
                <input id="show-balance-button" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
