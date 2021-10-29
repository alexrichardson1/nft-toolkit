import { deployContracts, getCollections } from "@controllers/collection";
import { User } from "@models/user";
import {
  mockCollection,
  mockCollectionInfo,
  mockFromAddress,
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

describe("Deploy contracts", () => {
  it("Should successfully return a transaction request", async () => {
    const mockRequest = {
      body: mockCollectionInfo,
    } as unknown as Request;
    mockRequest.body.fromAddress = mockFromAddress;
    await deployContracts(mockRequest, mockResponse, mockNext);
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
