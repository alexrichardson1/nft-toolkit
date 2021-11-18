import {
  GenCollectionI,
  generate,
  GeneratedCollectionI,
} from "@controllers/generateArt";

// eslint-disable-next-line max-lines-per-function
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
        rarity: 50,
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
    const PROB1 = 0.02;
    const PROB2 = 0.45;
    const PROB3 = 0.08;
    const PROB4 = 0.18;
    const PROB5 = 0.08;
    const PROB6 = 0.96;
    setMathRandomReturn([PROB1, PROB2, PROB3, PROB4, PROB5, PROB6]);
    const result = generate(testData);
    expect(result).toMatchObject({
      name: "Monkeys",
      symbol: "MNKY",
      description: "Test data thingy",
      quantity: 1,
      images: [
        {
          hash: "background/black,body/fat,head/durag,",
          images: [
            { name: "black", rarity: 30 },
            { name: "fat", rarity: 20 },
            { name: "durag", rarity: 5 },
          ],
          rarity: 0.15,
        },
      ],
    });
  });

  test("Different random values produce different combinations", () => {
    testData.quantity = 2;
    const PROB1 = 0.0;
    const PROB2 = 0.3;
    const PROB3 = 0.0;
    const PROB4 = 0.905;
    const PROB5 = 0.0;
    const PROB6 = 0.6999;
    const PROB7 = 0.0;
    const PROB8 = 0.6;
    const PROB9 = 0.0;
    const PROB10 = 0.5;
    const PROB11 = 0.0;
    const PROB12 = 0.95;

    setMathRandomReturn([
      // red, normal, bald
      PROB1,
      PROB2,
      PROB3,
      PROB4,
      PROB5,
      PROB6,
      // black, skinny, spiky
      PROB7,
      PROB8,
      PROB9,
      PROB10,
      PROB11,
      PROB12,
    ]);

    expect(generate(testData)).toMatchObject({
      name: "Monkeys",
      symbol: "MNKY",
      description: "Test data thingy",
      quantity: 2,
      images: [
        {
          hash: "background/red,body/normal,head/bald,",
          images: [
            { name: "red", rarity: 30 },
            { name: "normal", rarity: 10 },
            { name: "bald", rarity: 70 },
          ],
          rarity: 1.05,
        },
        {
          hash: "background/black,body/skinny,head/spiky,",
          images: [
            { name: "black", rarity: 30 },
            { name: "skinny", rarity: 70 },
            { name: "spiky", rarity: 25 },
          ],
          rarity: 2.625,
        },
      ],
    });
  });

  test("No duplicates can exist in the collection", () => {
    testData.quantity = 2;
    const PROB1 = 0.0;
    const PROB2 = 0.3;
    const PROB3 = 0.0;
    const PROB4 = 0.905;
    const PROB5 = 0.0;
    const PROB6 = 0.6999;
    const PROB7 = 0.0;
    const PROB8 = 0.3;
    const PROB9 = 0.0;
    const PROB10 = 0.905;
    const PROB11 = 0.0;
    const PROB12 = 0.6999;

    setMathRandomReturn([
      PROB1,
      PROB2,
      PROB3,
      PROB4,
      PROB5,
      PROB6,
      PROB7,
      PROB8,
      PROB9,
      PROB10,
      PROB11,
      PROB12,
    ]);

    const expected = [
      { name: "red", rarity: 30 },
      { name: "normal", rarity: 10 },
      { name: "bald", rarity: 70 },
    ];

    const collection: GeneratedCollectionI = generate(testData);
    if (!collection.images[0] || !collection.images[1]) {
      throw Error("Something went wrong");
    }
    expect(collection.images[0].images).toMatchObject(expected);
    expect(collection.images[1].images).not.toMatchObject(expected);
  });

  test("Trying to make more NFTs than there are possible combinations of features throws an error", () => {
    testData.quantity = 100;

    expect(() => generate(testData)).toThrowError();
  });

  test("Non-100 rarity layers have a change of not being included", () => {
    testData.quantity = 1;
    const PROB1 = 0.02;
    const PROB2 = 0.45;
    const PROB3 = 0.58;
    const PROB4 = 0.08;
    const PROB5 = 0.96;
    setMathRandomReturn([PROB1, PROB2, PROB3, PROB4, PROB5]);
    const result = generate(testData);
    expect(result).toMatchObject({
      name: "Monkeys",
      symbol: "MNKY",
      description: "Test data thingy",
      quantity: 1,
      images: [
        {
          hash: "background/black,head/durag,",
          images: [
            { name: "black", rarity: 30 },
            { name: "durag", rarity: 5 },
          ],
          rarity: 0.75,
        },
      ],
    });
  });
});
