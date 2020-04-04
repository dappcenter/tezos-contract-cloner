import React, { ReactElement } from "react";
import { NetworkProps } from "./types";
import Select from "react-select";
import { useForm } from "react-hook-form";
import "./styles.css";

const ContractNetwork = (props: NetworkProps): ReactElement => {
  const { handleNetworkChange, network, handleLaunchSubmit } = props;
  const { register, handleSubmit } = useForm();

  const selectValue = { value: network, label: network.charAt(0).toUpperCase() + network.slice(1) };

  const options = [
    { value: "mainnet", label: "Mainnet" },
    { value: "carthagenet", label: "Carthagenet" },
    { value: "sandbox", label: "Sandbox" }
  ];

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
            <input id="show-balance-button" type="submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ContractNetwork;
