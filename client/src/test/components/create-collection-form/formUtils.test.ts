import {
  startLoading,
  stopLoading,
} from "components/create-collection-form/formUtils";

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
});
