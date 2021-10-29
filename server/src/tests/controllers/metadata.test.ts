import { getTokenMetadata } from "@controllers/metadata";
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

describe("Token Metadata", () => {
  it("Should fail if called with invalid params", async () => {
    const mockRequest = {
      params: {
        collectionName: "Monkeys",
        tokenId: "1",
      },
    } as unknown as Request;

    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if user does not exist in db", async () => {
    const mockRequest = {
      params: {
        fromAddress: "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        collectionName: "Monkeys",
        tokenId: "1",
      },
    } as unknown as Request;

    await getTokenMetadata(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("User not found"));
  });
});
