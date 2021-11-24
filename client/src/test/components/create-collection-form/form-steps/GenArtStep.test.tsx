import { Web3ReactProvider } from "@web3-react/core";
import GenArtStep from "components/create-collection-form/form-steps/GenArtStep";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: NaN,
  static: { images: {}, numberOfImages: 0 },
  generative: { layers: [], numberOfLayers: 0 },
};

describe("GenArtStep", () => {
  test("Page Number matches", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <GenArtStep stepNumber={3} state={INITIAL_STATE} generative />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  test("Page Number does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <GenArtStep stepNumber={0} state={INITIAL_STATE} generative />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  test("generative does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <GenArtStep
              stepNumber={0}
              state={INITIAL_STATE}
              generative={false}
            />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
