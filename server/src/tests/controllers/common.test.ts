import { errorHandler, ERROR_CODE } from "@controllers/common";
import { NextFunction, Request, Response } from "express";

jest.mock("express-validator", () => {
  return {
    validationResult: jest.fn((req) => ({
      isEmpty: jest.fn(() => !req.body.errors),
      array: jest.fn(),
    })),
  };
});

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
    const mockRequest = { body: { errors: false } } as unknown as Request;
    errorHandler(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("Should send response with error code and errors if validator errors present", () => {
    const mockRequest = { body: { errors: true } } as unknown as Request;
    errorHandler(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(ERROR_CODE);
  });
});
