import React, { useState, ReactElement } from "react";
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
  const [contractAddress, setContractAddress] = useState<string>("");
  const [provider, setProvider] = useState<string>("https://api.tez.ie/rpc/carthagenet");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const handleLaunchNetworkChange = async (network: string): Promise<void> => {
    // Empty provider if network is sandbox so that user can provide a local node address
    if (network !== "sandbox") {
      await Tezos.setProvider({ rpc: `https://api.tez.ie/rpc/${network}` });
      setProvider(`https://api.tez.ie/rpc/${network}`);
    }
    setProvider(`https://api.tez.ie/rpc/${network}`);
    setLaunchNetwork(network);
  };

  const handleContractNetworkChange = (network: string): void => {
    // Empty provider if network is sandbox so that user can provide a local node address
    if (network === "sandbox") {
      setProvider("");
    }
    setProvider(`https://api.tez.ie/rpc/${network}`);
    setContractNetwork(network);
  };

  const handleLaunchSubmit = async (): Promise<void> => {
    setProvider(`https://api.tez.ie/rpc/${launchNetwork}`);
    // Ensure provider is set to Launch Contract div's desired network
    await Tezos.setProvider({ rpc: `https://api.tez.ie/rpc/${launchNetwork}` });
    // Originate a new contract
    Tezos.contract
      .originate({
        code: code as any,
        init: storage as any
      })
      .then(originationOp => {
        return originationOp.contract();
      })
      .then(contract => {
        setTxnAddress(contract.address);
        showSnackbar(true);
      });
  };

  const onSubmit = async (): Promise<any> => {
    await Tezos.setProvider({ rpc: provider });
    // Import key because you need a key to call a contract
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    const newContract = await Tezos.contract.at(contractAddress);
    setCode(newContract.script.code);
    setStorage(newContract.script.storage);
  };

  const closeSnackbar = (): void => {
    showSnackbar(false);
  };

  const updateProvider = async (provider: string): Promise<void> => {
    setProvider(provider);
    await Tezos.setProvider({ rpc: provider });
  };

  const updateContractAddress = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setContractAddress(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <Provider provider={provider} updateProvider={updateProvider} />
      <div id="wallet">
        <h1>Taquito Contract Tool</h1>
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
                    href={`https://${launchNetwork}.tzstats.com/${txnAddress}`}
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
                <input
                  onChange={updateContractAddress}
                  placeholder="Contract Address"
                  id="address-input"
                  name="address"
                  ref={register}
                />
                <br />
                <input id="show-balance-button" type="submit" />
              </form>
            </div>
          </div>
        </div>
        <div>
          <div id="dialog">
            <h2>Launch Contract</h2>
            <LaunchNetwork
              handleLaunchSubmit={handleLaunchSubmit}
              handleNetworkChange={handleLaunchNetworkChange}
              network={launchNetwork}
            />
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
