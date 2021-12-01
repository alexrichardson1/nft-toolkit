import { AttributeI, TokenT } from "@models/collection";
import axios from "axios";
import sharp from "sharp";
import { s3 } from "./common";

interface ImageI {
  name: string;
  rarity: number;
  image: string;
}

export interface LayerI {
  name: string;
  images: ImageI[];
  rarity: number;
}

interface TierI {
  name: string;
  probability: number;
}

interface GeneratedImageI {
  hash: string;
  images: [number, string, string][];
  rarity: number;
  attributes: AttributeI[];
}

export interface GenCollectionI {
  layers: LayerI[];
  tiers: TierI[];
  quantity: number;
  name: string;
  creator: string;
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

function generateOneCombination(layers: LayerI[]): GeneratedImageI {
  const chosenLayerImages: [number, string, string][] = [];
  let hash = "";
  let layerIndex = 0;
  let rarity = 1;
  const oneHundred = 100;
  const attributes: AttributeI[] = [];
  layers.forEach((layer) => {
    const includeLayer = generateRandomPercentage() <= layer.rarity;
    if (includeLayer) {
      const [chosenIndex, chosenImage] = chooseLayerImage(layer.images);

      hash += `${layer.name}/${chosenImage.name},`;
      chosenLayerImages[layerIndex++] = [
        chosenIndex,
        layer.name,
        chosenImage.name,
      ];
      attributes.push({ trait_type: layer.name, value: chosenImage.name });
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
    attributes,
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
          const buffer = await axios.get(image.image, {
            responseType: "arraybuffer",
          });
          return buffer.data;
        })
      );
    })
  );
  return res;
}

interface LayerQI {
  [key: string]: number;
  total: number;
}

interface LayersQI {
  [key: string]: LayerQI;
}

const updateLayerQuantities = (
  layerName: string,
  imgName: string,
  quantities: LayersQI
) => {
  let layer: LayerQI | undefined;
  if (quantities[layerName]) {
    layer = quantities[layerName];
  } else {
    quantities[layerName] = { total: 0 };
    layer = quantities[layerName];
  }

  if (layer) {
    if (layer[imgName]) {
      layer[imgName]++;
      layer.total++;
    } else {
      layer[imgName] = 1;
      layer.total++;
    }
  }
};

async function compileImage(
  generatedImage: GeneratedImageI,
  layerBuffers: LayerBuffersI,
  index: number,
  name: string,
  creator: string,
  layerQuantities: LayersQI
): Promise<TokenT> {
  let resultImage: sharp.Sharp | undefined;

  const composites: sharp.OverlayOptions[] = [];
  generatedImage.images.forEach(([layerIndex, layerName, imgName], index) => {
    updateLayerQuantities(layerName, imgName, layerQuantities);

    const buffer = layerBuffers[layerName]?.[layerIndex];
    if (index) {
      composites.push({ input: buffer });
    } else {
      resultImage = sharp(buffer);
    }
  });

  if (!resultImage) {
    throw new Error("Cannot compile image when none is given");
  }

  const buffer = await resultImage
    .composite(composites)
    .toFormat("png", { quality: 80 })
    .toBuffer();
  const uploadKey = `${creator}/${name}/images/${index}.png`;
  const uploadParams = {
    Bucket: "nft-toolkit-collections",
    Body: buffer,
    Key: uploadKey,
    ACL: "public-read",
  };

  s3.upload(uploadParams).promise();

  return {
    name: `${name} ${index}`,
    image: `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${uploadKey}`,
    attributes: generatedImage.attributes,
    description: "",
  };
}

const toPercent = 100;

const addRarityScore = (img: TokenT, layerQuantities: LayersQI) => {
  let prob = toPercent * toPercent;
  img.attributes.forEach((attr) => {
    let layer;
    if (layerQuantities[attr.trait_type]) {
      layer = layerQuantities[attr.trait_type];
    }
    if (layer) {
      prob *= (layer[attr.value] ?? 1) / layer.total;
    }
  });

  img.attributes.push({ trait_type: "rarity_score", value: prob });
};

const sortByRarity = (aToken: TokenT, bToken: TokenT): number => {
  const aRarityScore = aToken.attributes[aToken.attributes.length - 1];
  const bRarityScore = bToken.attributes[bToken.attributes.length - 1];
  if (aRarityScore && bRarityScore) {
    return (
      parseInt(aRarityScore.value.toString()) -
      parseInt(bRarityScore.value.toString())
    );
  }
  throw new Error("Cannot sort tokens without rarity score");
};

const addTiers = (tokens: TokenT[], sortedTokens: TokenT[], tiers: TierI[]) => {
  const increment = 1 / tokens.length;
  let current = 0;
  let curLayer = 0;
  sortedTokens.forEach((token) => {
    const tier = tiers[curLayer];
    if (!tier) {
      throw new Error("Cannot find tier");
    }
    if (tier.probability < current * toPercent) {
      curLayer++;
    }
    current += increment;
    token.attributes.push({ trait_type: "tier", value: tier.name });
  });
};

/**
 * PRE: Layer images are assumed to be of equal dimensions, so that we don't
 * have to positition any features ourselves
 * @param collection - Collection of picture layers
 */
async function generate(collection: GenCollectionI): Promise<TokenT[]> {
  const { layers, quantity, name, creator, tiers } = collection;
  let numPossibleCombinations = 1;
  layers.forEach((layer) => {
    numPossibleCombinations *= layer.images.length;
  });

  if (numPossibleCombinations < quantity) {
    throw new Error(
      "There are less possible combinations than quantity requested"
    );
  }

  const images = [];
  const generatedHashes = new Set();
  const layerBuffers = await getImages(layers);
  const layerFreq: LayersQI = {};

  for (let i = 0; i < quantity; i++) {
    const image = generateOneCombination(layers);

    if (generatedHashes.has(image.hash)) {
      // Duplicate made - repeat loop
      i--;
      continue;
    }

    images.push(compileImage(image, layerBuffers, i, name, creator, layerFreq));
    generatedHashes.add(image.hash);
  }
  const tokens = await Promise.all(images);
  tokens.forEach((token) => addRarityScore(token, layerFreq));
  const sortedTokens = [...tokens].sort(sortByRarity);

  addTiers(tokens, sortedTokens, tiers);
  return tokens;
}

export { generate, compileImage, GeneratedImageI, ImageI };
