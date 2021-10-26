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

function generateRandomPercentage() {
  const MAX_RAND = 100;
  // TODO: make sure this is a uniform distribution with 0-100 inclusive
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

    if (generatedHashes.has(hash)) {
      // Duplicate made - repeat loop
      i--;
      continue;
    }

    generatedCollection[i] = chosenLayerImages;
    generatedHashes.add(hash);
  }
  return generatedCollection;
}

export { generate, GenCollectionI };
