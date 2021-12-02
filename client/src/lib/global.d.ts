interface ProviderPropsI {
  children: React.ReactNode;
}

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
}

interface FormStateI {
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
    totalLayerRarities: number[];
    quantity: string;
  };
}

interface AttributeI {
  [trait_type: string]: string;
}

interface CollectionI {
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
