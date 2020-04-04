import React, { ReactElement, useState } from "react";
import { LaunchFormProps } from "./types";
import Select from "react-select";
import { useForm } from "react-hook-form";
import "./styles.css";

const LaunchForm = (props: LaunchFormProps): ReactElement => {
  const { handleNetworkChange, network, handleLaunchSubmit } = props;
  const { register, handleSubmit } = useForm();

  const selectValue = { value: network, label: network.charAt(0).toUpperCase() + network.slice(1) };

  const options = [
    { value: "mainnet", label: "Mainnet" },
    { value: "carthagenet", label: "Carthagenet" },
    { value: "sandbox", label: "Sandbox" }
  ];

  const handleClick = (e: any) => {
    console.log(e.target.value);
  };

  const handleChange = (selectedOption: any) => {
    handleNetworkChange(selectedOption.value);
  };

  return (
    <>
      <Select
        name="address"
        ref={register}
        className="network-select"
        options={options}
        value={selectValue}
        onChange={handleChange}
      />
      <div id="content">
        <div id="balance-form">
          <form onSubmit={handleSubmit(handleLaunchSubmit)}>
            <span className="signer-toolbar" style={{ display: "flex" }}>
              <input
                onClick={handleClick}
                value="faucet"
                id="faucet"
                className="signer-button"
                type="radio"
                autoFocus
              />
              <label htmlFor="faucet">Faucet Key</label>
              <input onClick={handleClick} value="tezbridge" id="tezbridge" className="signer-button" type="radio" />
              <label htmlFor="tezbridge">TezBridge</label>
              <input onClick={handleClick} value="beacon" id="beacon" className="signer-button" type="radio" />
              <label htmlFor="beacon">Beacon</label>
            </span>
            <input id="show-balance-button" type="submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default LaunchForm;
