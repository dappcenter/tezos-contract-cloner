import React, { useEffect, useState } from "react";
import { Tezos, TezosToolkit } from "@taquito/taquito";
import "./App.css";
import logo from "./assets/built-with-taquito.png";

const App: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    Tezos.setProvider({ rpc: "https://rpc.tezrpc.me" });
  }, []);

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  const showBalance = () => {
    Tezos.rpc
      .getBalance(address)
      .then(balance => setBalance(balance.toNumber() / 1000000))
      .catch(e => setError("Address not found"));
  };

  return (
    <div className="App">
      <h1>Taquito Boilerplate App</h1>
      <div id="dialog">
        <div id="header">Show Balance</div>
        <div id="content">
          <div id="balance-form">
            <input id="address-input" onChange={handleAddressChange} type="text" placeholder="Enter wallet address" />
            <a onClick={showBalance} id="show-balance-button" href="#">
              Show
            </a>
          </div>
          <div id={`${error}` ? "error-message" : ""}>{error}</div>
          <div id="balance-output">
            <span id="balance">{balance}</span>ꜩ
          </div>
        </div>
      </div>
      <div id="footer">
        <img src={logo} />
      </div>
    </div>
  );
};

export default App;
