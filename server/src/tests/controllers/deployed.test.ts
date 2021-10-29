import { addDeployedAddress } from "@controllers/deployed";
import { User, UserT } from "@models/user";
import db from "@tests/testDB";
import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";
import {
  mockCollection,
  mockDeployedAddress,
  mockFromAddress,
  mockInvalidCollectionName,
  mockValidCollectionName,
} from "../mockCollectionInfo";

const mockRequest = {
  params: {
    fromAddress: mockFromAddress,
    collectionName: mockInvalidCollectionName,
    deployedAddress: mockDeployedAddress,
  },
} as unknown as Request;
let mockResponse: Response;
let mockNext: NextFunction;
let mockUser: Document<unknown, unknown, UserT> &
  UserT & {
    _id: Types.ObjectId;
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

describe("Add contract address to collection", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if user does not exist in db", async () => {
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("User not found"));
  });

  it("Should fail if collection does not exist in db", async () => {
    await mockUser.save();
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Collection name not found")
    );
  });

  it("Should succeed to set deployed address", async () => {
    const mockRequest = {
      params: {
        fromAddress: mockFromAddress,
        collectionName: mockValidCollectionName,
        deployedAddress: mockDeployedAddress,
      },
    } as unknown as Request;
    await mockUser.save();
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    const user = await User.findOne({
      fromAddress: mockFromAddress,
      "collections.address": mockDeployedAddress,
    });
    expect(user).toBeTruthy();
  });
});
