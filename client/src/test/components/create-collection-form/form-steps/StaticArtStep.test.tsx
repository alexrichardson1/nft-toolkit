import { Web3ReactProvider } from "@web3-react/core";
import StaticArtStep from "components/create-collection-form/form-steps/StaticArtStep";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    quantity: "1",
    tiers: [],
    numberOfTiers: 0,
    layers: [],
    numberOfLayers: 0,
  },
  predictions: { names: [], hype: -1 },
};

describe("StaticArtStep", () => {
  test("pageNumber does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <StaticArtStep
              stepNumber={0}
              state={INITIAL_STATE}
              generative={false}
              isLoading={false}
              handleImgDelete={jest.fn()}
              handleImgNameChange={jest.fn()}
              handleImgDrop={jest.fn()}
              handleImgDescChange={jest.fn()}
            />
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
            <StaticArtStep
              stepNumber={1}
              state={INITIAL_STATE}
              generative={true}
              isLoading={false}
              handleImgDelete={jest.fn()}
              handleImgNameChange={jest.fn()}
              handleImgDrop={jest.fn()}
              handleImgDescChange={jest.fn()}
            />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("pageNumber and generative match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <StaticArtStep
              stepNumber={1}
              state={INITIAL_STATE}
              generative={false}
              isLoading={false}
              handleImgDelete={jest.fn()}
              handleImgNameChange={jest.fn()}
              handleImgDrop={jest.fn()}
              handleImgDescChange={jest.fn()}
            />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
