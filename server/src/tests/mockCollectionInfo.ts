import { Collection, Token } from "@models/collection";

export const mockTokenInfo = {
  name: "First NFT",
  description: "A simple not monkey",
  image:
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
};
export const mockDeployedAddress = "0x2575c52d161648B03428B76c3a5003436b514eBC";
export const mockCreator = "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752";
export const mockValidCollectionName = "NotMonkeys";

const mockToken = new Token(mockTokenInfo);
export const mockCollectionInfo = {
  creator: mockCreator,
  description: "Example",
  chainId: "4",
  tokens: [mockToken],
  layers: [],
};
export const mockCollection = new Collection(mockCollectionInfo);
