import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Tezos } from "@taquito/taquito";
import FAUCET_KEY from "./utils/carthage-wallet";
import MuiAlert from "@material-ui/lab/Alert";
import "./App.css";
import { useForm } from "react-hook-form";

const App: any = () => {
  const { register, handleSubmit } = useForm();
  const [providerMsg, setProviderMsg] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const onSubmit = async (data: any) => {
    Tezos.setProvider({ rpc: data.rpc });
    setProviderMsg("Provider set and key file is importing");
    Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    showSnackbar(true);
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };

  return (
    <div id="rpc">
      <h3>
        <ul>
          <li>1. Set provider</li>
          <li>2. Key is auto-imported as faucet wallet from /utils/carthage-wallet.ts</li>
        </ul>
      </h3>
      <h3>Provider</h3>
      {providerMsg && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbar}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
            {providerMsg}
          </MuiAlert>
        </Snackbar>
      )}
      <div id="rpc-dialog">
        <div id="rpc-content">
          <div id="balance-form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input placeholder="Set your provider" id="rpc-input" name="rpc" ref={register} />
              <br />
              <input id="show-balance-button" type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;