import React, { useState, useEffect } from "react";
import { Tezos } from "@taquito/taquito";
import { MichelsonV1Expression } from "@taquito/rpc";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./components/Provider/Provider";
import Network from "./components/Network/Network";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/carthage-wallet";
import AceEditor from "react-ace";
import Navbar from "./components/Navbar/Navbar";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnAddress, setTxnAddress] = useState("");
  const [code, setCode] = useState<MichelsonV1Expression[]>([]);
  const [storage, setStorage] = useState<MichelsonV1Expression | string>();
  const [network, setNetwork] = useState<string>("carthagenet");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const handleNetworkChange = (event: React.ChangeEvent) => {
    setNetwork((event.target as HTMLSelectElement).value as string);
  };

  const onSubmit = async (data: any): Promise<any> => {
    // Import key because you need a key to call a contract
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    const newContract = await Tezos.contract.at("KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC");
    setCode(newContract.script.code);

    // Originate a new contract
    Tezos.contract
      .originate({
        code: newContract.script.code,
        init: newContract.script.storage
      })
      .then(originationOp => {
        return originationOp.contract();
      })
      .then(contract => {
        setTxnAddress(contract.address);
        showSnackbar(true);
      });
  };

  const closeSnackbar = () => {
    showSnackbar(false);
  };

  return (
    <div>
      <Navbar />
      <Provider />
      <div id="wallet">
        <h1>{network.charAt(0).toUpperCase() + network?.slice(1)} Contract Tool</h1>
        {txnAddress && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackbar}
            autoHideDuration={5000}
            onClose={closeSnackbar}
          >
            <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
              {txnAddress && (
                <>
                  Launched new contract at {txnAddress}
                  <a target="_blank" rel="noopener noreferrer" href={`https://${network}.tzstats.com/${txnAddress}`}>
                    View on TzStats
                  </a>
                </>
              )}
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
          <Network handleNetworkChange={handleNetworkChange} network={network} />
          <div id="content">
            <div id="balance-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Contract Address" id="address-input" name="address" ref={register} />
                <br />
                <input id="show-balance-button" type="submit" />
              </form>
            </div>
          </div>
        </div>
        <pre id="editor">
          <AceEditor
            mode="json"
            theme="monokai"
            value={JSON.stringify(code, null, 2)}
            name="editor"
            editorProps={{ $blockScrolling: true }}
          />
        </pre>
      </div>
    </div>
  );
};

export default App;
