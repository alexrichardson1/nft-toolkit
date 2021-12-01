import axios from "axios";
import { UnsignedTransaction } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { API_URL } from "utils/constants";

export const startLoading = (
  setLoadingMessage: SetStateAction<string>,
  setIsLoading: SetStateAction<boolean>,
  message = "Loading..."
): void => {
  setLoadingMessage(message);
  setIsLoading(true);
};

export const stopLoading = (
  setLoadingMessage: SetStateAction<string>,
  setIsLoading: SetStateAction<boolean>
): void => {
  setIsLoading(false);
  setLoadingMessage("");
};

export const uploadImages = async (
  images: ImageI[],
  account: string,
  collectionName: string
): Promise<void> => {
  const formData = new FormData();

  images.forEach((img, index) => {
    const fileName = img.image.name;
    const ext = fileName.split(".").pop();
    const newFile = new File([img.image], `${index + 1}.${ext}`, {
      type: img.image.type,
    });
    formData.append(`${account}/${collectionName}`, newFile);
  });

  await axios.post(`${API_URL}/collection/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

interface ServerLayerI {
  name: string;
  images: {
    name: string;
    rarity: number;
    image: string;
  }[];
  rarity: number;
}

export const uploadGenImages = async (
  layers: LayerI[],
  account: string,
  collectionName: string
): Promise<ServerLayerI[]> => {
  const formData = new FormData();

  const result = layers.map((layer) => {
    const images = Object.values(layer.images).map((img, index) => {
      const fileName = img.image.name;
      const ext = fileName.split(".").pop();
      const newFileName = `${index + 1}.${ext}`;
      const newFile = new File([img.image], `${index + 1}.${ext}`, {
        type: img.image.type,
      });
      const folderName = `${account}/${collectionName}/${layer.name}`;
      formData.append(folderName, newFile);
      return {
        name: img.name,
        image: `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${folderName}/images/${newFileName}`,
        rarity: parseInt(img.rarity ?? "1"),
      };
    });

    return {
      images,
      name: layer.name,
      rarity: 100,
    };
  });

  await axios.post(`${API_URL}/collection/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return result;
};

interface TransactionT {
  transaction: UnsignedTransaction;
}

export const uploadGenCollection = async (
  layers: ServerLayerI[],
  state: FormStateI,
  account: string,
  chainId: number
): Promise<UnsignedTransaction> => {
  const genCollection = {
    name: state.collectionName,
    symbol: state.symbol,
    description: state.description,
    price: parseUnits(state.mintingPrice).toString(),
    chainId: chainId,
    creator: account,
    layers: layers,
    tiers: state.generative.tiers,
    quantity: parseInt(state.generative.quantity),
  };

  const res = await axios.post(`${API_URL}/collection/save-gen`, genCollection);
  const tx: TransactionT = res.data;
  return tx.transaction;
};

export const uploadCollection = async (
  state: FormStateI,
  account: string,
  chainId: number
): Promise<UnsignedTransaction> => {
  const tokens = Object.values(state.static.images).map((image, index) => ({
    name: image.name,
    description: image.description ?? "",
    image: `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${account}/${
      state.collectionName
    }/images/${index + 1}.${image.image.name.split(".").pop()}`,
  }));

  const collection = {
    name: state.collectionName,
    symbol: state.symbol,
    description: state.description,
    price: parseUnits(state.mintingPrice).toString(),
    chainId: chainId,
    tokens: tokens,
    creator: account,
  };

  const res = await axios.post(`${API_URL}/collection/save`, collection);
  const tx: TransactionT = res.data;
  return tx.transaction;
};

export const addDeployedAddress = async (
  creator: string,
  chainId: number,
  address: string
): Promise<void> => {
  await axios.post(
    `${API_URL}/collection/deployed/${creator}/${chainId}/${address}`
  );
};

export const getSubmissionButtonText = (
  isLoading: boolean,
  isLastStep: boolean,
  loadingMessage: string
): string => {
  if (isLoading) {
    return loadingMessage;
  }
  if (isLastStep) {
    return "Submit";
  }
  return "Next";
};
