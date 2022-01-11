import {
  deployContracts,
  generateTokens,
  getAllCollections,
  getCollection,
  getUserCollections,
  makeGif,
  saveCollectionToDB,
  successHandler,
  transformTiers,
  uploadRemainingImgs,
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

jest.mock("@controllers/common", () => ({
  ...jest.requireActual("@controllers/common"),
  s3: {
    upload: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
  },
}));

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

describe("Make Gif", () => {
  it("Should fail if invalid tokens provided", () => {
    expect(makeGif([], "", "")).rejects.toThrowError(
      Error("Invalid tokens, must include at least one")
    );
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

describe("Get all collections", () => {
  it("Should succeed to get all collections", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;
    await getAllCollections(mockRequest, mockResponse, mockNext);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        collections: [],
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

describe("Transform tiers", () => {
  it("Should fail if called with undefined params", async () => {
    const mockRequest = {
      body: {},
    } as unknown as Request;
    await transformTiers(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid params"));
  });

  it("Should successfully transform tiers", async () => {
    const mockRequest = {
      body: {
        tiers: [
          { name: "legendary", probability: 5 },
          { name: "epic", probability: 10 },
          { name: "rare", probability: 15 },
          { name: "uncommon", probability: 20 },
          { name: "common", probability: 50 },
        ],
      },
    } as unknown as Request;
    await transformTiers(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.body.tiers).toEqual([
      { name: "legendary", probability: 5 },
      { name: "epic", probability: 15 },
      { name: "rare", probability: 30 },
      { name: "uncommon", probability: 50 },
      { name: "common", probability: 100 },
    ]);
  });
});

describe("Generate tokens", () => {
  it("Should fail if called with invalid params", async () => {
    const mockRequest = {
      body: { layers: [], tiers: [], quantity: 2, name: "", creator: "" },
    } as unknown as Request;
    await generateTokens(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      new Error("There are less possible combinations than quantity requested")
    );
  });

  it("Should successfully generate empty tokens", async () => {
    const mockRequest = {
      body: { layers: [], tiers: [], quantity: 0, name: "", creator: "" },
    } as unknown as Request;
    await generateTokens(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("Generate full img generation pipeline", () => {
  const TIMEOUT = 3600000;
  jest.setTimeout(TIMEOUT);

  it("Should successfully full generate tokens", async () => {
    const mockRequest = {
      body: {
        layers: [
          {
            name: "background",
            images: [
              {
                name: "blue",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Background/images/1.png",
                rarity: 15,
              },
              {
                name: "green",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Background/images/2.png",
                rarity: 25,
              },
              {
                name: "pink",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Background/images/3.png",
                rarity: 20,
              },
              {
                name: "purple",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Background/images/4.png",
                rarity: 15,
              },
              {
                name: "white",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Background/images/5.png",
                rarity: 25,
              },
            ],
            rarity: 100,
          },
          {
            name: "head",
            images: [
              {
                name: "base",
                image:
                  "https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752/Morkus+Babies/Base/images/1.png",
                rarity: 100,
              },
            ],
            rarity: 100,
          },
        ],
        tiers: [
          { name: "legendary", probability: 10 },
          { name: "common", probability: 90 },
        ],
        quantity: 4,
        name: "",
        creator: "",
      },
    } as unknown as Request;
    await generateTokens(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("Upload remaining images", () => {
  it("Should fail to upload none image", () => {
    const mockRequest = {
      body: {
        images: [
          {
            image: { hash: "", images: [], rarity: 100, attributes: [] },
            index: 0,
          },
        ],
        compInfo: { name: "", creator: "", layerBufs: {}, layerFreq: {} },
      },
    } as unknown as Request;
    expect(
      uploadRemainingImgs(mockRequest, mockResponse, mockNext)
    ).rejects.toThrow(Error("Cannot compile image when none is given"));
  });
});
