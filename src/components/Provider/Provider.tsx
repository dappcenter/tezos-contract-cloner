import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Tezos } from "@taquito/taquito";
import MuiAlert from "@material-ui/lab/Alert";
import "../../App.css";
import { useForm } from "react-hook-form";

const App: any = () => {
  const { register, handleSubmit } = useForm();
  const [providerMsg, setProviderMsg] = useState("");
  const [provider, setProvider] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const onSubmit = async (data: any) => {
    if (data.rpc) {
      await Tezos.setProvider({ rpc: data.rpc });
    }
    setProviderMsg("Provider set and key file is importing");
    showSnackbar(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };

  useEffect(() => {
    if (!provider) {
      Tezos.setProvider({ rpc: "https://api.tez.ie/rpc/carthagenet" });
      setProvider("https://api.tez.ie/rpc/carthagenet");
    }
  }, [provider]);

  return (
    <div id="rpc">
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
              <input
                value={provider}
                onChange={handleChange}
                placeholder="Set your provider"
                id="rpc-input"
                name="rpc"
                ref={register}
              />
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
