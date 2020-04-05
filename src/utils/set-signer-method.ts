import { HttpBackend } from "@taquito/taquito-http-utils";
import { RemoteSigner } from "@taquito/taquito-remote-signer";
import { Tezos } from "@taquito/taquito";

const setSignerMethod = async (mechanism: string, launchNetwork: string) => {
  switch (mechanism) {
    case "ephemeral":
      const httpClient = new HttpBackend();
      const { id, pkh } = await httpClient.createRequest({
        url: `https://api.tez.ie/keys/${launchNetwork}/ephemeral`,
        method: "POST",
        headers: { Authorization: "Bearer taquito-example" },
      });
      const signer = new RemoteSigner(pkh, `https://api.tez.ie/keys/${launchNetwork}/ephemeral/${id}/`, {
        headers: { Authorization: "Bearer taquito-example" },
      });
      await Tezos.setSignerProvider(signer);
      break;

    case "tezbridge":
      console.log("tezbridge");
      break;

    case "beacon":
      console.log("becaon");
      break;

    default:
      break;
  }
};

export default setSignerMethod;
