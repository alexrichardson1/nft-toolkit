import TierSelectionStep from "components/create-collection-form/form-steps/TierSelectionStep";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: { tiers: [], numberOfTiers: 0, layers: [], numberOfLayers: 0 },
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
            stepNumber={2}
            state={INITIAL_STATE}
            generative={false}
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
            stepNumber={2}
            state={INITIAL_STATE}
            generative={true}
            handleTierAdd={jest.fn()}
            handleTierRemoval={jest.fn()}
            handleTierReorder={jest.fn()}
          />
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
