import React, { useState } from "react";
import { Tezos, TezosToolkit } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./Provider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/carthage-wallet";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnAddress, setTxnAddress] = useState("");
  const [code, setCode] = useState("");
  const [storage, setStorage] = useState("");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);
  const toolkit = new TezosToolkit();
  const onSubmit = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    await Tezos.rpc.getScript("KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf").then(t => {
      setCode(JSON.stringify(t.code as any));
      setStorage(JSON.stringify(t.storage as any));
    });
    // await toolkit.rpc.getScript("KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf").then(t => console.log(t));
    // setTxnAddress(data.address);
    // showSnackbar(true);
    // const txn = Tezos.contract
    //   .at(data.address)
    //   .then(contract => console.log(contract))
    //   .catch(error => setError(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    // return txn;
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };

  return (
    <div>
      <Provider />
      <div id="wallet">
        <h1>Carthagenet Contract Tool</h1>

        {txnAddress ? (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
              {txnAddress ? (
                <>
                  Grabbing data from {txnAddress}
                  <a target="_blank" rel="noopener noreferrer" href={`https://carthagenet.tzstats.com/${txnAddress}`}>
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
                <input placeholder="Contract Address" id="address-input" name="address" ref={register} />
                <br />
                <input id="show-balance-button" type="submit" />
              </form>
            </div>
            {storage ||
              (code && (
                <div>
                  {storage} {code}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
