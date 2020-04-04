import React, { useState } from "react";
import { Tezos } from "@taquito/taquito";
import { MichelsonV1Expression } from "@taquito/rpc";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./components/Provider/Provider";
import ContractNetwork from "./components/ContractNetwork/ContractNetwork";
import LaunchNetwork from "./components/LaunchNetwork/LaunchNetwork";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/carthage-wallet";
import Navbar from "./components/Navbar/Navbar";
import { split as SplitEditor } from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnAddress, setTxnAddress] = useState("");
  const [code, setCode] = useState<MichelsonV1Expression[]>([]);
  const [storage, setStorage] = useState<MichelsonV1Expression | string>();
  const [launchNetwork, setLaunchNetwork] = useState<string>("carthagenet");
  const [contractNetwork, setContractNetwork] = useState<string>("carthagenet");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const handleLaunchNetworkChange = (network: string) => {
    setLaunchNetwork(network);
  };

  const handleContractNetworkChange = (network: string) => {
    setContractNetwork(network);
  };

  const onSubmit = async (data: any): Promise<any> => {
    // Import key because you need a key to call a contract
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    const newContract = await Tezos.contract.at("KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC");
    setCode(newContract.script.code);
    setStorage(newContract.script.storage);
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
        <h1>{contractNetwork.charAt(0).toUpperCase() + contractNetwork.slice(1)} Contract Tool</h1>
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
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://${contractNetwork}.tzstats.com/${txnAddress}`}
                  >
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
          <h2>Get Contract Code</h2>
          <ContractNetwork handleNetworkChange={handleContractNetworkChange} network={contractNetwork} />
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
        <div>
          <div id="dialog">
            <h2>Launch Contract</h2>
            <LaunchNetwork handleNetworkChange={handleLaunchNetworkChange} network={launchNetwork} />
            <div id="content">
              <div id="balance-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input id="show-balance-button" type="submit" />
                </form>
              </div>
            </div>
          </div>
          <div id="contract-code-editor">
            <SplitEditor
              width="90vw"
              height="300px"
              mode="json"
              theme="monokai"
              tabSize={2}
              splits={2}
              style={{ borderRadius: "5px", margin: "0 auto" }}
              orientation="beside"
              value={[
                `${code.length > 0 ? "// Contract Code \n" + JSON.stringify(code, null, 2) : "// Contract Code"} `,
                `${storage ? "// Storage Code \n" + JSON.stringify(storage, null, 2) : "// Storage Code "}`
              ]}
              name="contract-code-editor"
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
