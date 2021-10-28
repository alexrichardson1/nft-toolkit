import SnackbarContext from "context/snackbar/SnackbarContext";
import testContext from "../ContextTestsHelper";

describe("SnackbarContext", () => {
  testContext("initial showSnackbar", SnackbarContext, (value) => {
    value.showSnackbar("success", "test");
    return value.showSnackbar;
  });
});
