/* eslint-disable no-magic-numbers */
import { GenCollectionI, generate } from "../controllers/generateArt";

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setMathRandomReturn(vals: number[]): void {
    let i = 0;
    Math.random = () => {
      return vals[i++] || 0;
    };
  }

  test("Produces black background, fat body, durag head", () => {
    testData.quantity = 1;
    setMathRandomReturn([0.02, 0.45, 0.08, 0.18, 0.08, 0.96]);
    const expected = [
      [
        { name: "black", rarity: 30 },
        { name: "fat", rarity: 20 },
        { name: "durag", rarity: 5 },
      ],
    ];
    const result = generate(testData);
    expect(result).toMatchObject(expected);
  });

  test("Different random values produce different combinations", () => {
    testData.quantity = 2;
    setMathRandomReturn([
      // red, normal, bald
      0.0, 0.3, 0.0, 0.905, 0.0, 0.6999,
      // black, skinny, spiky
      0.0, 0.6, 0.0, 0.5, 0.0, 0.95,
    ]);
    const expected = [
      [
        { name: "red", rarity: 30 },
        { name: "normal", rarity: 10 },
        { name: "bald", rarity: 70 },
      ],
      [
        { name: "black", rarity: 30 },
        { name: "skinny", rarity: 70 },
        { name: "spiky", rarity: 25 },
      ],
    ];

    expect(generate(testData)).toMatchObject(expected);
  });

  // test("TODO", () => {
  //   const vals = Array.from({ length: 30 }, (_, i) => i + 1);
  //   let i = 0;
  //   Math.random = () => {
  //     return vals[i++] || 0;
  //   };
  //   console.log(generate(testData));
  // });

  // TODO: Write a test for duplicates
});
