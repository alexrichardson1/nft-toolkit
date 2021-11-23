import { getTokenMetadata } from "@controllers/metadata";
import { Collection, CollectionT } from "@models/collection";
import {
  mockCollectionInfo,
  mockDeployedAddress,
  mockTokenInfo,
} from "@tests/mockCollectionInfo";
import db from "@tests/testDB";
import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";

let mockResponse: Response;
let mockNext: NextFunction;
let mockCollection: Document<unknown, unknown, CollectionT> &
  CollectionT & {
    _id: Types.ObjectId;
  };

const getMockRequest = ({
  chainId = "4",
  address = mockDeployedAddress,
  tokenId = "0",
}: {
  chainId?: string;
  address?: string;
  tokenId?: string;
} = {}) => {
  return {
    params: {
      chainId: chainId,
      address: address,
      tokenId: tokenId,
    },
  } as unknown as Request;
};

beforeAll(async () => {
  await db.connect();
});

beforeEach(() => {
  mockResponse = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  mockNext = jest.fn();
  mockCollection = new Collection({
    ...mockCollectionInfo,
    ...{ address: mockDeployedAddress },
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

  it("Should fail if collection does not exist in db", async () => {
    await getTokenMetadata(getMockRequest(), mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Collection not found"));
  });

  it("Should fail if token does not exist in collection", async () => {
    const mockRequest = getMockRequest({
      tokenId: "2",
    });
    await mockCollection.save();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Token id not found in collection")
    );
  });

  it("Should succeed if token does exist in collection", async () => {
    await mockCollection.save();
    await getTokenMetadata(getMockRequest(), mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(mockTokenInfo)
    );
  });
});
