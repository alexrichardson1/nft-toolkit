import { render, screen } from "@testing-library/react";
import App from "components/App";

test("renders hello wolrd message", () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});
