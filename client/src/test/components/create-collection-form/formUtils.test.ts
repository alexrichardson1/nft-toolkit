import axios from "axios";
import {
  addDeployedAddress,
  startLoading,
  stopLoading,
  uploadCollection,
  uploadImages,
} from "components/create-collection-form/formUtils";

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

  test("Uploading images", () => {
    axios.post.mockResolvedValue(true);
    const mockFile = new File([], "testFileName.jpg", { type: "image/jpeg" });
    const mockImages = [{ image: mockFile, url: "", name: "test", id: "1" }];
    expect(
      uploadImages(
        mockImages,
        "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
        "Test Collection"
      )
    ).resolves.not.toThrow();
  });

  test("Saving collection", () => {
    axios.post.mockResolvedValue({ data: { transaction: {} } });
    const mockFile = new File([], "testFileName.jpg", { type: "image/jpeg" });
    const mockImages = [{ image: mockFile, url: "", name: "test", id: "1" }];
    const mockState = {
      collectionName: "Test Collection",
      description: "Example description",
      images: mockImages,
      mintingPrice: 0,
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
        "Test Collection",
        "0x81b7E08F65Bdf5648606c89998A9CC8164397647"
      )
    ).resolves.not.toThrow();
  });
});
