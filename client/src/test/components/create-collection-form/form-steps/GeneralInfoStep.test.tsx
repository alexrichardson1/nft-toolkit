import GeneralInfoStep from "components/create-collection-form/form-steps/GeneralInfoStep";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: { layers: [], numberOfLayers: 0 },
};

describe("GeneralInfoStep", () => {
  test("Page Number matches", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
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
  test("Page Number does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <GeneralInfoStep
            stepNumber={1}
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
