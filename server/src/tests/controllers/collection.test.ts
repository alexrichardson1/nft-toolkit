import {
  deployContracts,
  getCollection,
  getCollections,
  saveCollectionToDB,
  successHandler,
} from "@controllers/collection";
import { User } from "@models/user";
import {
  mockCollection,
  mockCollectionInfo,
  mockFromAddress,
  mockInvalidCollectionName,
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
    mockRequest.body.fromAddress = mockFromAddress;
    await saveCollectionToDB(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("Should successfully add a collection to existing user", async () => {
    const mockRequest = {
      body: mockCollectionInfo,
    } as unknown as Request;
    mockRequest.body.fromAddress = mockFromAddress;
    const mockUser = new User({
      collections: [mockCollectionInfo],
      fromAddress: mockFromAddress,
    });
    await mockUser.save();
    await saveCollectionToDB(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });
});

describe("Deploy contracts", () => {
  it("Should successfully return a transaction request", () => {
    const mockRequest = {
      body: mockCollectionInfo,
    } as unknown as Request;
    mockRequest.body.fromAddress = mockFromAddress;
    deployContracts(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction: expect.any(Object),
      })
    );
  });
});

describe("Get collections", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getCollections(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if user does not exist in db", async () => {
    const mockRequest = {
      params: { fromAddress: mockFromAddress },
    } as unknown as Request;
    await getCollections(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("User not found"));
  });

  it("Should successfully return collections", async () => {
    const mockRequest = {
      params: { fromAddress: mockFromAddress },
    } as unknown as Request;
    const mockUser = new User({
      fromAddress: mockFromAddress,
      collections: [mockCollection],
    });
    await mockUser.save();
    await getCollections(mockRequest, mockResponse, mockNext);
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

  it("Should fail if user does not exist in db", async () => {
    const mockRequest = {
      params: {
        fromAddress: mockFromAddress,
        collectionName: mockValidCollectionName,
      },
    } as unknown as Request;
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("User not found"));
  });

  it("Should fail if collection does not exist in db", async () => {
    const mockRequest = {
      params: {
        fromAddress: mockFromAddress,
        collectionName: mockInvalidCollectionName,
      },
    } as unknown as Request;
    const mockUser = new User({
      fromAddress: mockFromAddress,
      collections: [mockCollection],
    });
    await mockUser.save();
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Collection not found"));
  });

  it("Should successfully return collection", async () => {
    const mockRequest = {
      params: {
        fromAddress: mockFromAddress,
        collectionName: mockValidCollectionName,
      },
    } as unknown as Request;
    const mockUser = new User({
      fromAddress: mockFromAddress,
      collections: [mockCollection],
    });
    await mockUser.save();
    await getCollection(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: expect.any(Object),
      })
    );
  });
});
