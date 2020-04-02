import React, { useState, useEffect } from "react";
import { Tezos } from "@taquito/taquito";
import { MichelsonV1Expression } from "@taquito/rpc";
import "./App.css";
import { useForm } from "react-hook-form";
import Provider from "./Provider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FAUCET_KEY from "./utils/carthage-wallet";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [txnAddress, setTxnAddress] = useState("");
  const [code, setCode] = useState<MichelsonV1Expression[] | string>([]);
  const [storage, setStorage] = useState<MichelsonV1Expression | string>();
  const [network, setNetwork] = useState<string>("carthagenet");
  const [error, setError] = useState("");
  const [snackbar, showSnackbar] = useState(false);

  // useEffect(() => {
  //   if (code) {
  //     console.log(code);
  //   }
  //   if (storage) {
  //     console.log(storage);
  //   }
  // }, [code, storage]);
  const handleChange = (event: React.ChangeEvent) => {
    //@ts-ignore
    console.log(event.target.value as any);
    setNetwork((event.target as HTMLSelectElement).value as string);
  };

  const onSubmit = async (data: any): Promise<any> => {
    await Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    const newContract = await Tezos.contract.at("KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC");

    // setCode(contract.script.code);
    // setStorage(contract.script.storage);
    console.log(newContract.script.code, newContract.script.storage);

    const originationOp = await Tezos.contract.originate({
      code: newContract.script.code,
      init: newContract.script.storage
    });
    const contract = await originationOp.contract();
    await console.log(contract);

    //   .then(op => op.contract());
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
        <h1>{network.charAt(0).toUpperCase() + network?.slice(1)} Contract Tool</h1>

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
                  <a target="_blank" rel="noopener noreferrer" href={`https://${network}.tzstats.com/${txnAddress}`}>
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

        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">Network</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={network}
            onChange={e => handleChange(e as any)}
          >
            <MenuItem value="carthagenet">Carthagenet</MenuItem>
            <MenuItem value="mainnet">Mainnet</MenuItem>
            <MenuItem value="sandbox">Sandbox</MenuItem>
          </Select>
          <FormHelperText>Choose A Network</FormHelperText>
        </FormControl>

        <div id="dialog">
          <div id="content">
            <div id="balance-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Contract Address" id="address-input" name="address" ref={register} />
                <br />
                <input id="show-balance-button" type="submit" />
              </form>
            </div>

            <div>
              <pre>{code && JSON.stringify(code)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
