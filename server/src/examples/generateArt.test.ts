import {
  compileOneImage,
  GenCollectionI,
  generate,
} from "@controllers/generateArt";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const collection: GenCollectionI = {
  name: "Funky Ones",
  symbol: "FNKY",
  description: "It's about to get funky",
  quantity: 200,
  layers: [
    {
      name: "background",
      images: [
        {
          name: "crusty-yellow",
          rarity: 30,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.0.png")
          ),
        },
        {
          name: "decent-blue",
          rarity: 35,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.1.png")
          ),
        },
        {
          name: "fuschia",
          rarity: 15,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.2.png")
          ),
        },
        {
          name: "emerald",
          rarity: 5,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.3.png")
          ),
        },
        {
          name: "cozy-pink",
          rarity: 15,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.4.png")
          ),
        },
      ],
      rarity: 100,
    },
    {
      name: "base",
      rarity: 100,
      images: [
        {
          name: "base",
          rarity: 100,
          image: readFileSync(join(__dirname, "../../examples/base/1.0.png")),
        },
      ],
    },
    {
      name: "eyes",
      rarity: 100,
      images: [
        {
          name: "closed",
          rarity: 20,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.0.png")),
        },
        {
          name: "looking-up",
          rarity: 15,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.1.png")),
        },
        {
          name: "bug-eyed",
          rarity: 15,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.2.png")),
        },
        {
          name: "winkyyyy",
          rarity: 25,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.3.png")),
        },
        {
          name: "bare-cute",
          rarity: 10,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.4.png")),
        },
        {
          name: "cool-don",
          rarity: 5,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.5.png")),
        },
        {
          name: "willy-wonka",
          rarity: 10,
          image: readFileSync(join(__dirname, "../../examples/eyes/3.6.png")),
        },
      ],
    },
    {
      name: "features",
      rarity: 50,
      images: [
        {
          name: "bad-boy-tats",
          rarity: 10,
          image: readFileSync(
            join(__dirname, "../../examples/features/2.0.png")
          ),
        },
        {
          name: "freckles",
          rarity: 30,
          image: readFileSync(
            join(__dirname, "../../examples/features/2.1.png")
          ),
        },
        {
          name: "gold-earring",
          rarity: 20,
          image: readFileSync(
            join(__dirname, "../../examples/features/2.2.png")
          ),
        },
        {
          name: "gone-thru-hell-n-back",
          rarity: 40,
          image: readFileSync(
            join(__dirname, "../../examples/features/2.3.png")
          ),
        },
      ],
    },
    {
      name: "hat",
      rarity: 30,
      images: [
        {
          name: "heli-chopper",
          rarity: 30,
          image: readFileSync(join(__dirname, "../../examples/hat/5.0.png")),
        },
        {
          name: "santa",
          rarity: 35,
          image: readFileSync(join(__dirname, "../../examples/hat/5.1.png")),
        },
        {
          name: "yankee-wit-no-brim",
          rarity: 25,
          image: readFileSync(join(__dirname, "../../examples/hat/5.2.png")),
        },
        {
          name: "crown",
          rarity: 10,
          image: readFileSync(join(__dirname, "../../examples/hat/5.3.png")),
        },
      ],
    },
    {
      name: "mouth",
      rarity: 100,
      images: [
        {
          name: "silly-tongue",
          rarity: 45,
          image: readFileSync(join(__dirname, "../../examples/mouth/4.0.png")),
        },
        {
          name: "peter-griffin-balls",
          rarity: 5,
          image: readFileSync(join(__dirname, "../../examples/mouth/4.1.png")),
        },
        {
          name: "frown",
          rarity: 35,
          image: readFileSync(join(__dirname, "../../examples/mouth/4.2.png")),
        },
        {
          name: "joker",
          rarity: 15,
          image: readFileSync(join(__dirname, "../../examples/mouth/4.3.png")),
        },
      ],
    },
  ],
};

describe("Generate Art", () => {
  const TIMEOUT = 3600000;
  jest.setTimeout(TIMEOUT);

  test("Generating and compiling large collection works", async () => {
    const generated = generate(collection);
    console.log(generated);
    const oneHundred = 100;
    let rarest = oneHundred;
    let rarestIndex = 0;
    for (let i = 0; i < generated.images.length; i++) {
      const image = generated.images[i];
      if (!image) {
        throw Error("That shouldn't have happened");
      }
      const compiled = await compileOneImage(image);
      writeFileSync(
        join(__dirname, `../../examples/output/${i}.png`),
        compiled.image
      );
      if (image.rarity < rarest) {
        rarest = image.rarity;
        rarestIndex = i;
      }
      console.log(`${i}.png rarity: ${image.rarity}%`);
    }
    console.log(`Rarest: Image ${rarestIndex}.png rarity: ${rarest}`);
  });
});
