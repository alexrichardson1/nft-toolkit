import { TransactionRequest } from "@ethersproject/providers";
import { ManagedUpload } from "aws-sdk/clients/s3";
import axios from "axios";
import { Deferrable, parseUnits } from "ethers/lib/utils";
import { API_URL, s3 } from "utils/constants";

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

const uploadToS3 = (
  folder: string,
  newFileName: string,
  file: File
): Promise<ManagedUpload.SendData> => {
  const uploadParams = {
    Bucket: "nft-toolkit-collections",
    Body: file,
    Key: `${folder}/images/${newFileName}`,
    ACL: "public-read",
  };
  return s3.upload(uploadParams).promise();
};

export const uploadImages = (
  images: ImageI[],
  account: string,
  collectionName: string
): Promise<ManagedUpload.SendData[]> => {
  const folderName = `${account}/${collectionName}`;

  return Promise.all(
    images.map((img, index) => {
      const ext = img.image.name.split(".").pop();
      const newFileName = `${index + 1}.${ext}`;
      return uploadToS3(folderName, newFileName, img.image);
    })
  );
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

export const uploadGenImages = (
  layers: LayerI[],
  account: string,
  collectionName: string
): Promise<ServerLayerI[]> => {
  return Promise.all(
    layers.map(async (layer) => {
      const folderName = `${account}/${collectionName}/${layer.name}`;

      const images = await Promise.all(
        Object.values(layer.images).map(async (img, index) => {
          const ext = img.image.name.split(".").pop();
          const newFileName = `${index + 1}.${ext}`;
          await uploadToS3(folderName, newFileName, img.image);

          return {
            name: img.name,
            image: `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${folderName}/images/${newFileName}`,
            rarity: parseInt(img.rarity ?? "1"),
          };
        })
      );

      return {
        images,
        name: layer.name,
        rarity: parseFloat(layer.probability),
      };
    })
  );
};

interface TransactionT {
  transaction: Deferrable<TransactionRequest>;
}

export const uploadGenCollection = async (
  layers: ServerLayerI[],
  state: FormStateI,
  account: string,
  chainId: number
): Promise<Deferrable<TransactionRequest>> => {
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
): Promise<Deferrable<TransactionRequest>> => {
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
