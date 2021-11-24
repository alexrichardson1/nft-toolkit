import { addDeployedAddress } from "@controllers/deployed";
import { Collection } from "@models/collection";
import { User } from "@models/user";
import {
  mockCollectionInfo,
  mockCreator,
  mockDeployedAddress,
} from "@tests/mockCollectionInfo";
import db from "@tests/testDB";
import { NextFunction, Request, Response } from "express";

const mockRequest = {
  params: {
    creator: mockCreator,
    chainId: "4",
    address: mockDeployedAddress,
  },
} as unknown as Request;
let mockResponse: Response;
let mockNext: NextFunction;

beforeAll(async () => {
  await db.connect();
});

beforeEach(() => {
  mockResponse = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  mockNext = jest.fn();
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

  it("Should fail if collection does not exist in db", async () => {
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Collection not found"));
  });

  it("Should fail if user does not exist in db", async () => {
    const mockCollection = new Collection(mockCollectionInfo);
    await mockCollection.save();
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    const user = await User.findOne({ _id: mockCreator });
    expect(user).toBeDefined();
  });

  it("Should succeed to set deployed address", async () => {
    const mockCollection = new Collection(mockCollectionInfo);
    await mockCollection.save();
    const mockUser = new User({
      _id: mockCreator,
      collections: [],
    });
    await mockUser.save();
    await addDeployedAddress(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    const user = await User.findOne({ _id: mockCreator });
    expect(user).toBeDefined();
  });
});
