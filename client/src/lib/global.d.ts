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
}

type ImageT = { [imageId: string]: ImageI };

type LayerImageT = { [imageId: string]: ImageI & { rarity?: number } };
interface LayerI {
  layerId: string;
  name: string;
  images: LayerImageT;
  numberOfImages: number;
}

interface FormStateI {
  collectionName: string;
  description: string;
  symbol: string;
  mintingPrice: number;
  static: { numberOfImages: number; images: ImageT };
  generative: { numberOfLayers: number; layers: LayerI[] };
}
