import TierSelectionStep from "components/create-collection-form/form-steps/TierSelectionStep";
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

describe("TierSelectionStep", () => {
  test("pageNumber does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <TierSelectionStep
            stepNumber={0}
            state={INITIAL_STATE}
            generative={true}
            handleTierAdd={jest.fn()}
            handleTierProbChange={jest.fn()}
            handleTierRemoval={jest.fn()}
            handleTierReorder={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("generative does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <TierSelectionStep
            stepNumber={1}
            state={INITIAL_STATE}
            generative={false}
            handleTierProbChange={jest.fn()}
            handleTierAdd={jest.fn()}
            handleTierRemoval={jest.fn()}
            handleTierReorder={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("pageNumber and generative match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <TierSelectionStep
            stepNumber={1}
            state={INITIAL_STATE}
            generative={true}
            handleTierAdd={jest.fn()}
            handleTierRemoval={jest.fn()}
            handleTierReorder={jest.fn()}
            handleTierProbChange={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
