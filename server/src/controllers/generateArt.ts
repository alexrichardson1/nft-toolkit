import axios from "axios";
import sharp from "sharp";
import { s3 } from "./common";

interface ImageI {
  name: string;
  rarity: number;
  image?: string;
}

export interface LayerI {
  name: string;
  images: ImageI[];
  rarity: number;
}

interface GenCollectionI {
  name: string;
  symbol: string;
  description: string;
  quantity: number;
  layers: LayerI[];
}

interface GeneratedImageI {
  hash: string;
  images: [number, string][];
  rarity: number;
}

interface GeneratedCollectionI {
  name: string;
  symbol: string;
  description: string;
  quantity: number;
  images: ImageI[];
}

function generateRandomPercentage() {
  const MAX_RAND = 100;
  return Math.random() * MAX_RAND;
}

function chooseLayerImage(images: ImageI[]): [number, ImageI] {
  const randomValue = generateRandomPercentage();
  let rarityCumulative = 0;
  for (const [index, image] of images.entries()) {
    rarityCumulative += image.rarity;
    if (randomValue <= rarityCumulative) {
      return [index, image];
    }
  }
  throw new Error("Could not choose image");
}

function generateOneCombination(collection: GenCollectionI): GeneratedImageI {
  const chosenLayerImages: [number, string][] = [];
  let hash = "";
  let layerIndex = 0;
  let rarity = 1;
  const oneHundred = 100;
  collection.layers.forEach((layer) => {
    const includeLayer = generateRandomPercentage() <= layer.rarity;
    if (includeLayer) {
      const [chosenIndex, chosenImage] = chooseLayerImage(layer.images);

      hash += `${layer.name}/${chosenImage.name},`;
      chosenLayerImages[layerIndex++] = [chosenIndex, chosenImage.name];
      rarity *= layer.rarity;
      rarity *= chosenImage.rarity / (oneHundred * oneHundred);
    } else {
      rarity *= (oneHundred - layer.rarity) / oneHundred;
    }
  });

  return {
    hash: hash,
    images: chosenLayerImages,
    rarity: rarity * oneHundred,
  };
}

interface LayerBuffersI {
  [key: string]: Buffer[];
}

export async function getImages(layers: LayerI[]): Promise<LayerBuffersI> {
  const res: LayerBuffersI = {};
  await Promise.all(
    layers.map(async (layer) => {
      const layerName = layer.name;
      res[layerName] = await Promise.all(
        layer.images.map(async (image) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const buffer = await axios.get(image.image!, {
            responseType: "arraybuffer",
          });
          return buffer.data;
        })
      );
    })
  );
  return res;
}

async function compileOneImage(
  generatedImage: GeneratedImageI,
  layerBuffers: LayerBuffersI,
  index: number
): Promise<ImageI> {
  let resultImage = null;

  const composites = [];
  for (let i = 0; i < generatedImage.images.length; i++) {
    const image = generatedImage.images[i];
    if (!image) {
      throw new Error("Cannot compile image when none is given");
    }
    const buffer = layerBuffers[image[1]]?.[image[0]];
    if (resultImage) {
      composites.push({ input: buffer });
    } else {
      resultImage = sharp(buffer);
    }
  }
  if (!resultImage) {
    throw new Error("Cannot compile image when none is given");
  }

  resultImage.composite(composites);
  const buffer = await resultImage.toBuffer({ resolveWithObject: true });
  s3.upload({
    Bucket: "nft-toolkit-collections",
    Body: buffer.data,
    // TODO: Add folder name
    Key: `${index}.png`,
  });
  return {
    name: "",
    image: "",
    rarity: generatedImage.rarity,
  };
}

/**
 * PRE: Layer images are assumed to be of equal dimensions, so that we don't
 * have to positition any features ourselves
 * @param collection - Collection of picture layers
 */
async function generate(
  collection: GenCollectionI
): Promise<GeneratedCollectionI> {
  let numPossibleCombinations = 1;
  collection.layers.forEach((layer) => {
    numPossibleCombinations *= layer.images.length;
  });

  if (numPossibleCombinations < collection.quantity) {
    throw new Error(
      "There are less possible combinations than quantity requested"
    );
  }

  const generatedImages = [];
  const generatedHashes = new Set();
  const layerBuffers = await getImages(collection.layers);

  for (let i = 0; i < collection.quantity; i++) {
    const generatedImage = generateOneCombination(collection);

    if (generatedHashes.has(generatedImage.hash)) {
      // Duplicate made - repeat loop
      i--;
      continue;
    }

    generatedImages.push(compileOneImage(generatedImage, layerBuffers, i));
    generatedHashes.add(generatedImage.hash);
  }
  return {
    name: collection.name,
    symbol: collection.symbol,
    description: collection.description,
    quantity: collection.quantity,
    images: await Promise.all(generatedImages),
  };
}

export {
  generate,
  GenCollectionI,
  compileOneImage,
  GeneratedImageI,
  ImageI,
  GeneratedCollectionI,
};
