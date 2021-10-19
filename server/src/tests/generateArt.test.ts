import { generate, GenCollectionI } from "controllers/generateArt";

describe("Generate Art", () => {
  const testData: GenCollectionI = {
    name: "Monkeys",
    symbol: "MNKY",
    description: "Test data thingy",
    quantity: 10,
    layers: [
      {
        name: "background",
        images: [
          { name: "red", rarity: 30 },
          { name: "black", rarity: 30 },
          { name: "blue", rarity: 40 },
        ],
        rarity: 100,
      },
      {
        name: "body",
        images: [
          { name: "fat", rarity: 20 },
          { name: "skinny", rarity: 70 },
          { name: "normal", rarity: 10 },
        ],
        rarity: 100,
      },
      {
        name: "head",
        images: [
          { name: "bald", rarity: 70 },
          { name: "spiky", rarity: 25 },
          { name: "durag", rarity: 5 },
        ],
        rarity: 100,
      },
    ],
  };

  test("TODO", () => {
    // Math.random = () => 0;
    console.log(generate(testData));
  });
});
