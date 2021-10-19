interface ImageI {
  name: string;
  rarity: number;
  image?: Express.Multer.File;
}

interface LayerI {
  name: string;
  images: ImageI[];
}

interface GenCollectionI {
  name: string;
  symbol: string;
  description: string;
  quantity: number;
  layers: LayerI[];
}

/**
 * PRE: Layers are assumed to be of equal dimensions
 * @param collection - Collection of picture layers
 */
function generate(collection: GenCollectionI): ImageI[][] {
  const MAX_RAND = 100;
  const generatedCollection: ImageI[][] = [];
  for (let i = 0; i < collection.quantity; i++) {
    const chosenLayerImages: ImageI[] = [];
    let layerIndex = 0;
    collection.layers.forEach((layer) => {
      // TODO: make sure this is a uniform distribution with 0-100 inclusive
      const randomValue = Math.floor(Math.random() * MAX_RAND);
      let rarityCumulative = 0;
      layer.images.forEach((image) => {
        rarityCumulative += image.rarity;
        if (randomValue <= rarityCumulative) {
          chosenLayerImages[layerIndex] = image;
          return;
        }
        layerIndex++;
      });
    });
    generatedCollection[i] = chosenLayerImages;
  }
  return generatedCollection;
}

export { generate, GenCollectionI };
