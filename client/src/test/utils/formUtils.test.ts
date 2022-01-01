import axios from "axios";
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
} from "utils/formUtils";

jest.mock("axios");

describe("formUtils unit tests", () => {
  test("loading starts", () => {
    const mockSetLoadingMessage = jest.fn();
    const mockSetLoading = jest.fn();
    const testMessage = "loading";
    startLoading(mockSetLoadingMessage, mockSetLoading, testMessage);
    expect(mockSetLoadingMessage).toHaveBeenCalledWith(testMessage);
    expect(mockSetLoading).toHaveBeenCalledWith(true);
  });

  test("loading message is set before loading", () => {
    const mockSetLoadingMessage = jest.fn();
    const mockSetLoading = jest.fn();
    startLoading(mockSetLoadingMessage, mockSetLoading);

    if (mockSetLoading.mock.invocationCallOrder[0]) {
      expect(mockSetLoadingMessage.mock.invocationCallOrder[0]).toBeLessThan(
        mockSetLoading.mock.invocationCallOrder[0]
      );
    } else {
      fail("setLoadingMessage should be called BEFORE setLoading");
    }
  });

  test("loading stops", () => {
    const mockSetLoadingMessage = jest.fn();
    const mockSetLoading = jest.fn();
    stopLoading(mockSetLoadingMessage, mockSetLoading);
    expect(mockSetLoadingMessage).toHaveBeenCalledWith("");
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test("loading is stopped before resetting loading message", () => {
    const mockSetLoadingMessage = jest.fn();
    const mockSetLoading = jest.fn();
    stopLoading(mockSetLoadingMessage, mockSetLoading);

    if (mockSetLoading.mock.invocationCallOrder[0]) {
      expect(mockSetLoadingMessage.mock.invocationCallOrder[0]).toBeGreaterThan(
        mockSetLoading.mock.invocationCallOrder[0]
      );
    } else {
      fail("setLoading should be called BEFORE setLoadingMessage");
    }
  });

  test("Saving collection", () => {
    axios.post.mockResolvedValue({ data: { transaction: {} } });
    const mockFile = new File([], "testFileName.jpg", { type: "image/jpeg" });
    const mockImages = { "1": { image: mockFile, url: "", name: "test" } };
    const mockState = {
      twitterHandle: "twitter",
      redditHandle: "reddit",
      predictions: { collections: [], hype: 0, price: -1 },
      collectionName: "Test Collection",
      description: "Example description",
      static: { numberOfImages: 1, images: mockImages },
      marketplace: { wanted: false, royalty: "" },
      mintingPrice: "0",
      symbol: "TEST",
      generative: {
        numberOfTiers: 0,
        totalTierRarity: 0,
        tiers: [],
        layers: [],
        numberOfLayers: 0,
        quantity: "1",
      },
    };
    expect(
      uploadCollection(
        mockState,
        "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        1
      )
    ).resolves.not.toThrow();
  });

  test("Adding deployed contract", () => {
    axios.post.mockResolvedValue(true);
    expect(
      addDeployedAddress(
        "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        0,
        "0x81b7E08F65Bdf5648606c89998A9CC8164397647"
      )
    ).resolves.not.toThrow();
  });
});
