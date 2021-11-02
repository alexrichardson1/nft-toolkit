import { getTokenMetadata } from "@controllers/metadata";
import { User, UserT } from "@models/user";
import {
  mockCollection,
  mockFromAddress,
  mockInvalidCollectionName,
  mockTokenInfo,
  mockValidCollectionName,
} from "@tests/mockCollectionInfo";
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
  fromAddress = mockFromAddress,
  collectionName = mockInvalidCollectionName,
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
    fromAddress: mockFromAddress,
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
      collectionName: mockValidCollectionName,
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
      collectionName: mockValidCollectionName,
    });
    await mockUser.save();
    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(mockTokenInfo)
    );
  });
});
