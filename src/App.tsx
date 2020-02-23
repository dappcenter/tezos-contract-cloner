import React, { useState } from "react";
import { Tezos } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./Provider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/carthage-wallet";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnAmount, setTxnAmount] = useState(0);
  const [txnAddress, setTxnAddress] = useState("");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const onSubmit = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    setTxnAmount(parseInt(data.amount, 10));
    setTxnAddress(data.address);
    showSnackbar(true);
    const txn = Tezos.contract
      .transfer({ to: data.address, amount: parseInt(data.amount) })
      .then(op => {
        op.confirmation();
      })
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

        {txnAddress && txnAmount ? (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
              {txnAmount && txnAddress ? (
                <>
                  Sending {txnAmount} to {txnAddress}
                  <a target="_blank" href={`https://carthagenet.tzstats.com/${txnAddress}`}>
                    View on TzStats
                  </a>
                </>
              ) : null}
            </MuiAlert>
          </Snackbar>
        ) : null}

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
                <input placeholder="Amount of Tezos" id="address-input" name="amount" ref={register} />
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
