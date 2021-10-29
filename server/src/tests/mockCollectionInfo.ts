import { Collection, Token } from "@models/collection";

export const mockTokenInfo = {
  name: "First NFT",
  description: "A simple not monkey",
  image:
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
};
export const mockDeployedAddress = "0x1B156C5c75E9dF4CAAb2a5cc5999aC58ff4F9090";
export const mockFromAddress = "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752";
export const mockValidCollectionName = "NotMonkeys";
export const mockInvalidCollectionName = "Monkeys";

const mockToken = new Token(mockTokenInfo);
export const mockCollection = new Collection({
  name: mockValidCollectionName,
  symbol: "MNKYS",
  price: "1230000000000",
  chainId: 1,
  tokens: [mockToken],
});
