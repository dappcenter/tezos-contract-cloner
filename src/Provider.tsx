import React, { useEffect, SetStateAction } from "react";
import { Tezos } from "@taquito/taquito";
import "./App.css";
import { useForm } from "react-hook-form";

const App: any = ({ provider, setProvider }: { provider: string; setProvider: any }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await setProvider({ rpc: data.rpc });
  };

  return (
    <div id="rpc">
      <h3>Provider</h3>
      <div id="rpc-dialog">
        <div id="rpc-content">
          <div id="balance-form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input placeholder={provider} id="rpc-input" name="rpc" ref={register} />
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
