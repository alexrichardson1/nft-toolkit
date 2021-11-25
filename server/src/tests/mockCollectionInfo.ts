import { Collection, Token } from "@models/collection";

export const mockTokenInfo = {
  name: "First NFT",
  description: "A simple not monkey",
  image:
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
};
export const mockDeployedAddress = "0x1B156C5c75E9dF4CAAb2a5cc5999aC58ff4F9090";
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
