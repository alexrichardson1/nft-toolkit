import {
  deployContracts,
  getCollection,
  getUserCollections,
  saveCollectionToDB,
  successHandler,
} from "@controllers/collection";
import { Collection } from "@models/collection";
import { User, UserCollection } from "@models/user";
import {
  mockCollectionInfo,
  mockCreator,
  mockDeployedAddress,
  mockValidCollectionName,
} from "@tests/mockCollectionInfo";
import db from "@tests/testDB";
import { NextFunction, Request, Response } from "express";

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

describe("Success Handler", () => {
  it("Should successfully return success", () => {
    successHandler({} as unknown as Request, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });
});

describe("Save collection to db", () => {
  it("Should successfully add a new user and collection", async () => {
    const mockRequest = {
      body: mockCollectionInfo,
    } as unknown as Request;
    await saveCollectionToDB(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });
});

describe("Deploy contracts", () => {
  it("Should successfully return a transaction request", () => {
    const mockRequest = {
      body: mockCollectionInfo,
    } as unknown as Request;
    mockRequest.body.name = mockValidCollectionName;
    mockRequest.body.symbol = "MNKYS";
    mockRequest.body.price = "1230000000000";
    mockRequest.body.royalty = 0;
    deployContracts(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction: expect.any(Object),
      })
    );
  });
});

describe("Get user collections", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getUserCollections(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if user does not exist in db", async () => {
    const mockRequest = {
      params: { creator: mockCreator },
    } as unknown as Request;
    await getUserCollections(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it("Should successfully return collections", async () => {
    const mockRequest = {
      params: { creator: mockCreator },
    } as unknown as Request;
    const mockUserCollection = new UserCollection({
      address: "0x123",
      chainId: 4,
    });
    const mockUser = new User({
      _id: mockCreator,
      collections: [mockUserCollection],
    });
    await mockUser.save();
    await getUserCollections(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        collections: expect.any(Object),
      })
    );
  });
});

describe("Get collection", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if collection does not exist in db", async () => {
    const mockRequest = {
      params: {
        address: mockCreator,
        chainId: "4",
      },
    } as unknown as Request;
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Collection not found"));
  });

  it("Should successfully return collection", async () => {
    const mockRequest = {
      params: {
        address: mockDeployedAddress,
        chainId: "4",
      },
    } as unknown as Request;
    const mockCollection = new Collection({
      ...mockCollectionInfo,
      ...{ address: mockDeployedAddress },
    });
    await mockCollection.save();
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: expect.any(Object),
      })
    );
  });
});
