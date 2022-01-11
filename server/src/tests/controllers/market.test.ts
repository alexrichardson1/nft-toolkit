import { getMarketURL } from "@controllers/market";
import { Collection } from "@models/collection";
import {
  mockCollectionInfo,
  mockDeployedAddress,
} from "@tests/mockCollectionInfo";
import db from "@tests/testDB";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

const mockRequest = {
  params: {
    chainId: "4",
    address: mockDeployedAddress,
  },
  body: { marketAddress: "0x123" },
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

describe("Add opensea url", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getMarketURL(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should fail if called with unsupported chain", async () => {
    const mockRequest = {
      params: {
        chainId: "1",
        address: mockDeployedAddress,
      },
    } as unknown as Request;
    await getMarketURL(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid chainId"));
  });

  it("Should fail if collection does not exist in OpenSea", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: {} });
    await getMarketURL(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Collection not found in OpenSea")
    );
  });

  it("Should fail if collection does not exist in db", async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { collection: { slug: "" } } });
    await getMarketURL(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Collection not found"));
  });

  it("Should succeed to get OpenSea marketURL", async () => {
    const mockCollection = new Collection({
      ...mockCollectionInfo,
      address: mockDeployedAddress,
    });
    await mockCollection.save();
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: { collection: { slug: "" } } });
    await getMarketURL(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith({
      marketURL: "https://testnets.opensea.io/collection/",
    });
  });
});
