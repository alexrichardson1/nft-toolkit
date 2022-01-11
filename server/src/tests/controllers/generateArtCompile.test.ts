import { imageToMetadata } from "@controllers/generateArtCompile";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Image to Metadata", () => {
  it("Should succeed to create metadata", () => {
    const mockImgToCompile = {
      image: { hash: "exHash", images: [], rarity: 0, attributes: [] },
      index: 0,
    };
    const mockCompInfo = {
      name: "example collection",
      creator: "0xfe6A53f0a22F124DE96eCc1a9aBE10071D9AbB1a",
      layerBufs: {},
      layerFreq: {},
    };
    expect(imageToMetadata(mockImgToCompile, mockCompInfo)).toEqual({
      attributes: [],
      description: "",
      image:
        "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xfe6A53f0a22F124DE96eCc1a9aBE10071D9AbB1a/example collection/images/0.png",
      name: "example collection 0",
    });
  });
});
