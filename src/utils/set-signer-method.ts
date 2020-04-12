import { HttpBackend } from "@taquito/taquito-http-utils";
import { RemoteSigner } from "@taquito/taquito-remote-signer";
// import { BeaconWallet } from "@taquito/taquito-beacon-wallet";
// import { TezBridgeWallet } from "@taquito/taquito-tezbridge-wallet";

import { Tezos } from "@taquito/taquito";

const setSignerMethod = async (signer: string, contractNetwork: string, launchNetwork: string) => {
  switch (signer) {
    case "ephemeral":
      const httpClient = new HttpBackend();
      // launchNetwork ? launchNetwork : contractNetwork
      const { id, pkh } = await httpClient.createRequest({
        url: `https://api.tez.ie/keys/${launchNetwork}/ephemeral`,
        method: "POST",
        headers: { Authorization: "Bearer taquito-example" },
      });
      // launchNetwork ? launchNetwork : contractNetwork
      const signer = new RemoteSigner(
        pkh,
        `https://api.tez.ie/keys/${launchNetwork ? launchNetwork : contractNetwork}/ephemeral/${id}/`,
        {
          //@ts-ignore
          headers: { Authorization: "Bearer taquito-example" },
        }
      );
      await Tezos.setSignerProvider(signer);
      break;

    case "tezbridge":
      // await Tezos.setProvider({
      //   rpc: `https://api.tez.ie/rpc/${launchNetwork ? launchNetwork : contractNetwork}`,
      //   wallet: new TezBridgeWallet(),
      // });
      break;

    case "beacon":
      console.log("becaon");
      //   const wallet = new BeaconWallet({ name: 'test' })
      //   await wallet.requestPermissions()
      //   this.taquito.setProvider({ rpc: this.taquito.rpc, wallet });
      // }
      break;

    default:
      break;
  }
};

export default setSignerMethod;
