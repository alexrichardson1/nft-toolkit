import { compileOneImage, GeneratedImageI } from "@controllers/generateArt";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

describe("Generate Art", () => {
  const image: GeneratedImageI = {
    hash: "badboys2",
    images: [
      {
        name: "background_1",
        rarity: 10,
        image: readFileSync(
          join(__dirname, "../../examples/backgrounds/0.0.png")
        ),
      },
      {
        name: "base_1",
        rarity: 100,
        image: readFileSync(join(__dirname, "../../examples/base/1.0.png")),
      },
      {
        name: "eyes_2",
        rarity: 100,
        image: readFileSync(join(__dirname, "../../examples/eyes/3.2.png")),
      },
      {
        name: "features_0",
        rarity: 100,
        image: readFileSync(join(__dirname, "../../examples/features/2.0.png")),
      },
      {
        name: "hat_0",
        rarity: 100,
        image: readFileSync(join(__dirname, "../../examples/hat/5.0.png")),
      },
      {
        name: "mouth_2",
        rarity: 100,
        image: readFileSync(join(__dirname, "../../examples/mouth/4.2.png")),
      },
    ],
  };

  test("Image gets compiled", async () => {
    const compiled = await compileOneImage(image);
    writeFileSync(join(__dirname, "../../examples/output.png"), compiled.image);
  });

  test("No image throws error", () => {
    const image: GeneratedImageI = {
      hash: "badboys2",
      images: [
        {
          name: "background_1",
          rarity: 10,
          image: readFileSync(
            join(__dirname, "../../examples/backgrounds/0.0.png")
          ),
        },
        {
          name: "base_1",
          rarity: 100,
        },
      ],
    };

    expect(() => compileOneImage(image)).rejects.toThrowError();
  });
});
