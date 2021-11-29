// import { GenCollectionI, generate } from "../controllers/generateArt";

// describe("Generate Art", () => {
//   // 9*9*8*8*2 = 10368 total combinations
//   const testData: GenCollectionI = {
//     name: "Cooler Monkeys",
//     symbol: "MNKEE",
//     description: "Big ol collection",
//     quantity: 10_000,
//     layers: [
//       {
//         name: "background",
//         images: [
//           { name: "red", rarity: 15 },
//           { name: "black", rarity: 12 },
//           { name: "blue", rarity: 11 },
//           { name: "orange", rarity: 2 },
//           { name: "gray", rarity: 10 },
//           { name: "lilac", rarity: 7 },
//           { name: "primrose", rarity: 3 },
//           { name: "fuschia", rarity: 20 },
//           { name: "lavender", rarity: 20 },
//         ],
//         rarity: 100,
//       },
//       {
//         name: "body",
//         images: [
//           { name: "fat", rarity: 15 },
//           { name: "skinny", rarity: 12 },
//           { name: "normal", rarity: 8 },
//           { name: "strong", rarity: 5 },
//           { name: "super-strong", rarity: 30 },
//           { name: "massive", rarity: 2 },
//           { name: "dench", rarity: 8 },
//           { name: "bolo", rarity: 12 },
//           { name: "wham", rarity: 8 },
//         ],
//         rarity: 100,
//       },
//       {
//         name: "head",
//         images: [
//           { name: "bald", rarity: 9 },
//           { name: "spiky", rarity: 1 },
//           { name: "durag", rarity: 2 },
//           { name: "hat", rarity: 8 },
//           { name: "cap", rarity: 15 },
//           { name: "beanie", rarity: 25 },
//           { name: "mohawk", rarity: 35 },
//           { name: "afro", rarity: 5 },
//         ],
//         rarity: 100,
//       },
//       {
//         name: "jewellry",
//         images: [
//           { name: "tiffany-necklace", rarity: 2 },
//           { name: "cartier-ring", rarity: 3 },
//           { name: "cuban-chain", rarity: 5 },
//           { name: "buss-down-patek", rarity: 15 },
//           { name: "richard-millie", rarity: 35 },
//           { name: "versace-belt", rarity: 15 },
//           { name: "gucci-belt", rarity: 15 },
//           { name: "plain-jane-rollie", rarity: 10 },
//         ],
//         rarity: 100,
//       },
//       {
//         name: "shoes",
//         images: [
//           { name: "airforce-1s", rarity: 70 },
//           { name: "jordan-12s", rarity: 30 },
//         ],
//         rarity: 100,
//       },
//     ],
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("Testing that 10,000 images are generated", () => {
//     const generated = generate(testData);
//     expect(generated.images.length).toBe(testData.quantity);
//   });
// });
