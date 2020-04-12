import React, { useState, ReactElement } from "react";
import { Tezos } from "@taquito/taquito";
import { MichelsonV1Expression } from "@taquito/rpc";
import { split as SplitEditor } from "react-ace";
import Provider from "./components/Provider/Provider";
import ContractForm from "./components/ContractForm/ContractForm";
import LaunchForm from "./components/LaunchForm/LaunchForm";
import SnackbarGroup from "./components/SnackbarGroup/SnackbarGroup";
import Navbar from "./components/Navbar/Navbar";
import setSignerMethod from "./utils/set-signer-method";
import "./App.css";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

const App: React.FC = (): ReactElement => {
  const [txnAddress, setTxnAddress] = useState("");
  const [code, setCode] = useState<MichelsonV1Expression[]>([]);
  const [storage, setStorage] = useState<MichelsonV1Expression | string>();
  const [launchNetwork, setLaunchNetwork] = useState<string>("carthagenet");
  const [contractNetwork, setContractNetwork] = useState<string>("carthagenet");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [signer, setSigner] = useState<string>("ephemeral");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  const handleLaunchNetworkChange = async (network: string): Promise<void> => {
    // Empty provider if network is sandbox so that user can provide a local node address
    if (network !== "sandbox") {
      await Tezos.setProvider({ rpc: `https://api.tez.ie/rpc/${network}` });
      setProvider(`https://api.tez.ie/rpc/${network}`);
    }
    setProvider(network);
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

  const handleContractLaunchSubmit = async (): Promise<void> => {
    // Set snackbar
    setLoading(true);
    setLoadingMessage("Launching contract...");
    showSnackbar(true);
    // Ensure provider is set to Launch Contract div's desired network
    await Tezos.setProvider({ rpc: `https://api.tez.ie/rpc/${launchNetwork}` });
    await setSignerMethod(signer, contractNetwork, launchNetwork);

    // Make sure provider is updated to reflect launch network in the UI
    setProvider(`https://api.tez.ie/rpc/${launchNetwork}`);

    // Originate a new contract
    Tezos.contract
      .originate({
        code: code as any,
        init: storage as any,
      })
      .then((originationOp) => {
        return originationOp.contract();
      })
      .then((contract) => {
        // Remove contract launch snackbar message
        setLoading(false);
        showSnackbar(false);
        // Add block explorer snackbar message
        setLoadingMessage("");
        setTxnAddress(contract.address);
        showSnackbar(true);
      });
  };

  const handleContractCodeSubmit = async (): Promise<any> => {
    setLoading(true);
    setLoadingMessage("Loading contract code...");
    showSnackbar(true);
    await Tezos.setProvider({ rpc: provider });
    await setSignerMethod(signer, contractNetwork, launchNetwork);

    // Call contract and get code
    const newContract = await Tezos.contract.at(contractAddress);
    setCode(newContract.script.code);
    setStorage(newContract.script.storage);
    setLoading(false);
  };

  const closeSnackbar = (): void => {
    showSnackbar(false);
  };

  const updateProvider = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setProvider(event.target.value);
  };

  const updateContractAddress = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setContractAddress(event.target.value);
  };

  const updateSigner = (event: React.MouseEvent<HTMLInputElement>): void => {
    setSigner(event.currentTarget.value);
  };

  return (
    <div>
      <Navbar />
      <Provider loading={loading} provider={provider} updateProvider={updateProvider} />
      <div id="wallet">
        <h1>Taquito Contract Tool</h1>
        <SnackbarGroup
          launchNetwork={launchNetwork}
          txnAddress={txnAddress}
          snackbar={snackbar}
          closeSnackbar={closeSnackbar}
          error={error}
          loading={loading}
          loadingMessage={loadingMessage}
        />
        <ContractForm
          loading={loading}
          handleContractSubmit={handleContractCodeSubmit}
          updateContractAddress={updateContractAddress}
          handleNetworkChange={handleContractNetworkChange}
          network={contractNetwork}
        />
        <div>
          <LaunchForm
            loading={loading}
            signer={signer}
            updateSigner={updateSigner}
            handleLaunchSubmit={handleContractLaunchSubmit}
            handleNetworkChange={handleLaunchNetworkChange}
            network={launchNetwork}
          />
          <div id="contract-code-editor">
            {/* This is because of a types issue on Ace SplitEditor 
            // @ts-ignore */}
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
                `${storage ? "// Storage Code \n" + JSON.stringify(storage, null, 2) : "// Storage Code "}`,
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
