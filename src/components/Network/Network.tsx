import React, { ReactElement } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NetworkProps from "./types";
import "./styles.css";

const Network = (props: NetworkProps): ReactElement => {
  const { handleNetworkChange, network } = props;
  return (
    <FormControl className="network-form">
      <InputLabel id="network-label">Network</InputLabel>
      <Select labelId="network-label" value={network} onChange={e => handleNetworkChange(e as any)}>
        <MenuItem value="carthagenet">Carthagenet</MenuItem>
        <MenuItem value="mainnet">Mainnet</MenuItem>
        <MenuItem value="sandbox">Sandbox</MenuItem>
      </Select>
      <FormHelperText>Choose A Network</FormHelperText>
    </FormControl>
  );
};

export default Network;
