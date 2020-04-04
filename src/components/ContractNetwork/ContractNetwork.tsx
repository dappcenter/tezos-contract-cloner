import React, { ReactElement } from "react";
import { NetworkProps } from "./types";
import Select from "react-select";
import "./styles.css";

const ContractNetwork = (props: NetworkProps): ReactElement => {
  const { handleNetworkChange, network } = props;

  const selectValue = { value: network, label: network.charAt(0).toUpperCase() + network.slice(1) };

  const options = [
    { value: "mainnet", label: "Mainnet" },
    { value: "carthagenet", label: "Carthagenet" },
    { value: "sandbox", label: "Sandbox" }
  ];

  const handleChange = (selectedOption: any) => {
    handleNetworkChange(selectedOption.value);
  };

  return <Select className="network-select" options={options} value={selectValue} onChange={handleChange} />;
};

export default ContractNetwork;
