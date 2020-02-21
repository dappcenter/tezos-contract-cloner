import React, { useEffect, useState } from "react";
import { Tezos } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";
import FAUCET_KEY from "./utils/carthage-wallet";
import Provider from "./Provider";

const App: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [provider, setProvider] = useState("https://api.carthagenet.tzstats.com/");

  const onSubmit = async (data: any) => {
    const txn = await Tezos.contract.transfer({ to: data.address, amount: parseInt(data.amount) }).then(op => {});
  };

  useEffect(() => {
    Tezos.importKey(FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(" "), FAUCET_KEY.secret);
    Tezos.setProvider({ rpc: provider });
  }, []);

  return (
    <div>
      <Provider provider={provider} setProvider={setProvider} />
      <div id="wallet">
        <h1>Carthagenet Transaction Tool</h1>
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
