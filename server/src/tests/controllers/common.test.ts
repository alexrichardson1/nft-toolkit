import { errorHandler, ERROR_CODE } from "@controllers/common";
import { collectionValidator } from "@validators/collection";
import { NextFunction, Request, Response } from "express";

const mockRequest = {} as unknown as Request;
let mockResponse: Response;
let mockNext: NextFunction;

beforeEach(() => {
  mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => ({
      json: jest.fn(),
    })),
  } as unknown as Response;
  mockNext = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Validator Error Handler", () => {
  it("Should succeed if there are no errors", () => {
    errorHandler(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("Should send response with error code and errors if validator errors present", async () => {
    await Promise.all(
      collectionValidator().map(async (validator) => {
        await validator(mockRequest, mockResponse, mockNext);
      })
    );
    errorHandler(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(ERROR_CODE);
  });
});
