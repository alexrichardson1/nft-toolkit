import showAlert from "../../utils/showAlert";

describe("showAlert", () => {
  const setSeverity = jest.fn();
  const type = "success";
  const setMessage = jest.fn();
  const message = "";

  test("functions are called with correct arguments", () => {
    showAlert(setSeverity, type, setMessage, message);
    expect(setSeverity).toBeCalledWith(type);
    expect(setMessage).toBeCalledWith(message);
  });
});
