import React, { ReactElement } from "react";
import { ContractFormProps } from "./types";
import Select from "react-select";
import { useForm } from "react-hook-form";
import "./styles.css";

const ContractForm = (props: ContractFormProps): ReactElement => {
  const { handleNetworkChange, network, updateContractAddress, onSubmit } = props;
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
      <Select className="network-select" options={options} value={selectValue} onChange={handleChange} />
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
    </>
  );
};

export default ContractForm;
