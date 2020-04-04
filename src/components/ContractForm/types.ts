export interface ContractFormProps {
  handleNetworkChange: (network: string) => void;
  updateContractAddress: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  network: string;
}
