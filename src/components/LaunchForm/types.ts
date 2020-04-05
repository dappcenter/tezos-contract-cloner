export interface LaunchFormProps {
  updateSigner: (event: React.MouseEvent<HTMLInputElement>) => void;
  handleNetworkChange: (network: string) => void;
  handleLaunchSubmit: () => void;
  network: string;
}
