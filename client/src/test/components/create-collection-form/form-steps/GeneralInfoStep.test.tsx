import GeneralInfoStep from "components/create-collection-form/form-steps/GeneralInfoStep";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  twitterHandle: "",
  redditHandle: "",
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    numberOfTiers: 0,
    totalTierRarity: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "",
  },
  predictions: { names: [], hype: -1 },
};

describe("GeneralInfoStep", () => {
  test("Step Number matches with generative", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
            handleRedditChange={jest.fn()}
            handleTwitterChange={jest.fn()}
            generative
            stepNumber={4}
            state={INITIAL_STATE}
            handleCollNameChange={jest.fn()}
            handleDescriptionChange={jest.fn()}
            handleMintPriceChange={jest.fn()}
            handleSymbolChange={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  test("Step Number matches without generative", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
            handleRedditChange={jest.fn()}
            handleTwitterChange={jest.fn()}
            generative={false}
            stepNumber={2}
            state={INITIAL_STATE}
            handleCollNameChange={jest.fn()}
            handleDescriptionChange={jest.fn()}
            handleMintPriceChange={jest.fn()}
            handleSymbolChange={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  test("Step Number does not match when generative", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
            handleRedditChange={jest.fn()}
            handleTwitterChange={jest.fn()}
            generative
            stepNumber={0}
            state={INITIAL_STATE}
            handleCollNameChange={jest.fn()}
            handleDescriptionChange={jest.fn()}
            handleMintPriceChange={jest.fn()}
            handleSymbolChange={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  test("Step Number does not match when not generative", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
            handleRedditChange={jest.fn()}
            handleTwitterChange={jest.fn()}
            generative={false}
            stepNumber={0}
            state={INITIAL_STATE}
            handleCollNameChange={jest.fn()}
            handleDescriptionChange={jest.fn()}
            handleMintPriceChange={jest.fn()}
            handleSymbolChange={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
