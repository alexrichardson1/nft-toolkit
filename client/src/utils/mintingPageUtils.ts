import axios from "axios";
import { API_URL } from "./constants";

// TODO: collection gif
interface CollectionI {
  name: string;
  symbol: string;
  description: string;
  chainId: number;
  address: string;
}

export const getCollection = async (
  fromAddress: string,
  collectionName: string
): Promise<CollectionI> => {
  const res = await axios.get(
    `${API_URL}/collection/${fromAddress}/${collectionName}`
  );
  const { collection }: { collection: CollectionI } = res.data;
  return collection;
};
