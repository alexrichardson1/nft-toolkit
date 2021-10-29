import { getTokenMetadata } from "@controllers/metadata";
import { Collection, Token } from "@models/collection";
import { User, UserT } from "@models/user";
import db from "@tests/testDB";
import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";

let mockResponse: Response;
let mockNext: NextFunction;
let mockUser: Document<unknown, unknown, UserT> &
  UserT & {
    _id: Types.ObjectId;
  };

const getMockRequest = ({
  fromAddress = "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
  collectionName = "Monkeys",
  tokenId = "1",
}: {
  fromAddress?: string;
  collectionName?: string;
  tokenId?: string;
} = {}) => {
  return {
    params: {
      fromAddress: fromAddress,
      collectionName: collectionName,
      tokenId: tokenId,
    },
  } as unknown as Request;
};

const mockTokenInfo = {
  name: "First NFT",
  description: "A simple not monkey",
  image:
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
};
const mockToken = new Token(mockTokenInfo);
const mockCollection = new Collection({
  name: "NotMonkeys",
  symbol: "MNKYS",
  price: "1230000000000",
  chainId: 1,
  address: "0x1B156C5c75E9dF4CAAb2a5cc5999aC58ff4F9090",
  tokens: [mockToken],
});

beforeAll(async () => {
  await db.connect();
});

beforeEach(() => {
  mockResponse = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  mockNext = jest.fn();
  mockUser = new User({
    fromAddress: "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
    collections: [mockCollection],
  });
});

afterEach(async () => {
  await db.clear();
  jest.clearAllMocks();
});

afterAll(async () => {
  await db.close();
});

describe("Token Metadata", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if user does not exist in db", async () => {
    const mockRequest = getMockRequest();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("User not found"));
  });

  it("Should fail if collection does not exist in db", async () => {
    const mockRequest = getMockRequest();
    await mockUser.save();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Collection name not found")
    );
  });

  it("Should fail if token does not exist in collection", async () => {
    const mockRequest = getMockRequest({
      collectionName: "NotMonkeys",
      tokenId: "2",
    });
    await mockUser.save();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Token id not found in collection")
    );
  });

  it("Should succeed if token does exist in collection", async () => {
    const mockRequest = getMockRequest({
      collectionName: "NotMonkeys",
    });
    await mockUser.save();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(mockTokenInfo)
    );
  });
});
