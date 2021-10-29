import { deployContracts } from "@controllers/collection";
import { mockCollectionInfo, mockFromAddress } from "@tests/mockCollectionInfo";
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
