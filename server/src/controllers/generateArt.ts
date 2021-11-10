import { assert } from "console";
import images from "images";

interface ImageI {
  name: string;
  rarity: number;
  image?: Express.Multer.File;
}

interface LayerI {
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
  images: ImageI[];
}

interface CompiledImageI {
  hash: string;
  image: Buffer;
}

function generateRandomPercentage() {
  const MAX_RAND = 100;
  return Math.random() * MAX_RAND;
}

function chooseLayerImage(images: ImageI[]): ImageI {
  const randomValue = generateRandomPercentage();
  let rarityCumulative = 0;
  for (const image of images) {
    rarityCumulative += image.rarity;
    if (randomValue <= rarityCumulative) {
      return image;
    }
  }
  return {
    name: "fail",
    rarity: 0,
  };
}

function generateOneCombination(collection: GenCollectionI): GeneratedImageI {
  const chosenLayerImages: ImageI[] = [];
  let hash = "";
  let layerIndex = 0;
  collection.layers.forEach((layer) => {
    const includeLayer = generateRandomPercentage() <= layer.rarity;
    if (includeLayer) {
      const chosenImage: ImageI = chooseLayerImage(layer.images);

      hash += `${layer.name}/${chosenImage.name},`;
      chosenLayerImages[layerIndex++] = chosenImage;
    }
  });

  return {
    hash: hash,
    images: chosenLayerImages,
  };
}

/**
 * PRE: Layer images are assumed to be of equal dimensions, so that we don't
 * have to positition any features ourselves
 * @param collection - Collection of picture layers
 */
function generate(collection: GenCollectionI): ImageI[][] {
  let numPossibleCombinations = 1;
  collection.layers.forEach((layer) => {
    numPossibleCombinations *= layer.images.length;
  });

  if (numPossibleCombinations < collection.quantity) {
    throw new Error(
      "There are less possible combinations than quantity requested"
    );
  }

  const generatedCollection: ImageI[][] = [];
  const generatedHashes = new Set();

  for (let i = 0; i < collection.quantity; i++) {
    const generatedImage = generateOneCombination(collection);

    if (generatedHashes.has(generatedImage.hash)) {
      // Duplicate made - repeat loop
      i--;
      continue;
    }

    generatedCollection[i] = generatedImage.images;
    generatedHashes.add(generatedImage.hash);
  }
  return generatedCollection;
}

function compileOneImage(generatedImage: GeneratedImageI): CompiledImageI {
  let resultImage = null;

  for (let i = 0; i < generatedImage.images.length; i++) {
    const image = generatedImage.images[i];
    if (!image?.image) {
      throw new Error("Cannot compile image when none is given");
    }
    const thisImage = images.loadFromBuffer(image.image.buffer);
    if (resultImage) {
      resultImage.drawImage(thisImage, 0, 0);
    } else {
      resultImage = thisImage;
    }
  }

  // resultImage?.save("out.png");

  assert(resultImage !== null);
  if (resultImage) {
    const buffer = resultImage.toBuffer("png");
    return {
      hash: generatedImage.hash,
      image: buffer,
    };
  }

  throw new Error("Result image is null");
}

export { generate, GenCollectionI, compileOneImage };
