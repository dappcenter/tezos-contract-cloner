import { HttpBackend } from "@taquito/http-utils";
import { RemoteSigner } from "@taquito/remote-signer";
// import { BeaconWallet } from "@taquito/taquito-beacon-wallet";
import { TezBridgeSigner } from "@taquito/tezbridge-signer";
import { Tezos } from "@taquito/taquito";

const setSignerMethod = async (
  signer: string,
  contractNetwork: string,
  launchNetwork: string,
  code?: any,
  storage?: any,
  setLoading?: any,
  showSnackbar?: any,
  setLoadingMessage?: any,
  setTxnAddress?: any
) => {
  switch (signer) {
    case "ephemeral":
      const httpClient = new HttpBackend();
      const { id, pkh } = await httpClient.createRequest({
        url: `https://api.tez.ie/keys/${launchNetwork ? launchNetwork : contractNetwork}/ephemeral`,
        method: "POST",
        headers: { Authorization: "Bearer taquito-example" },
      });
      const signer = new RemoteSigner(
        pkh,
        `https://api.tez.ie/keys/${launchNetwork ? launchNetwork : contractNetwork}/ephemeral/${id}/`,
        {
          headers: { Authorization: "Bearer taquito-example" },
        }
      );
      await Tezos.setSignerProvider(signer);
      break;

    case "tezbridge":
      // Originate a new contract
      Tezos.contract
        .originate({
          code: code as any,
          init: storage as any,
        })
        .then((originationOp) => {
          return originationOp.contract();
        })
        .then((contract) => {
          // Remove contract launch snackbar message
          setLoading(false);
          showSnackbar(false);
          // Add block explorer snackbar message
          setLoadingMessage("");
          setTxnAddress(contract.address);
          showSnackbar(true);
        });

      break;

    case "beacon":
      // const wallet = new BeaconWallet({ name: 'test' })
      // await wallet.requestPermissions()
      // this.taquito.setProvider({ rpc: this.taquito.rpc, wallet });
      // }
      break;

    default:
      break;
  }
};

export default setSignerMethod;
