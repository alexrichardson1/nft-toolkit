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

interface LayerI {
  layerId: string;
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
  generative: { numberOfLayers: number; layers: LayerI[] };
}
