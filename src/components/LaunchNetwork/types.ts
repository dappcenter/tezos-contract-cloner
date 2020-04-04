export interface NetworkProps {
  handleNetworkChange: (network: string) => void;
  handleLaunchSubmit: () => void;
  network: string;
}
