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
  distance: number;
};

interface MlDataI {
  names: NameRecommendationT[];
  hype: number;
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
  predictions: MlDataI;
}

interface AttributeI {
  [trait_type: string]: string | number;
}

interface ContractAttributeI {
  trait_type: string;
  value: string | number;
}

interface TokenI {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  attributes: AttributeI;
}

interface ParamsI {
  paramChainId: string;
  address: string;
}
