import { Alert } from "context/snackbar/SnackbarProvider";
import { mount } from "enzyme";

test("alert snapshot", () => {
  expect(mount(<Alert />)).toMatchSnapshot();
});
