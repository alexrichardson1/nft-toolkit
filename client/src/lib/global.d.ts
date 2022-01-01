interface ProviderPropsI {
  children: React.ReactNode;
}

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

type NetworkT = { icon: string; name: string; chainId?: number };

type AnchorT = null | HTMLElement;

type InputEventT = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

interface ImageI {
  image: File;
  url: string;
  name: string;
  description?: string;
  rarity?: string;
}

type ImageT = { [imageId: string]: ImageI };

interface TierI {
  name: string;
  probability: string;
}
interface LayerI {
  name: string;
  images: ImageT;
  numberOfImages: number;
  probability: string;
  totalImageRarities: number;
}

type NameRecommendationT = {
  name: string;
  img: string;
};

interface MlDataI {
  collections: NameRecommendationT[];
  hype: number;
  price: number;
}

interface FormStateI {
  twitterHandle: string;
  redditHandle: string;
  collectionName: string;
  description: string;
  symbol: string;
  mintingPrice: string;
  static: { numberOfImages: number; images: ImageT };
  generative: {
    numberOfTiers: number;
    totalTierRarity: number;
    tiers: TierI[];
    numberOfLayers: number;
    layers: LayerI[];
    quantity: string;
  };
  marketplace: { wanted: boolean; royalty: string };
  predictions: MlDataI;
}

interface AttributeI {
  [trait_type: string]: string | number;
}

interface ContractAttributeI {
  trait_type: string;
  value: string | number;
}

interface ContractTokenI {
  name: string;
  description: string;
  image: string;
  attributes: ContractAttributeI[];
}

interface ParamsI {
  paramChainId: string;
  address: string;
}

interface CollAddrI {
  address: string;
  chainId: number;
  image: string;
}

interface CollDataI {
  name: string;
  symbol: string;
  chainId: number;
  address: string;
  balance: string;
  image: string;
  owner: string;
}
