import { Web3ReactProvider } from "@web3-react/core";
import GeneralInfo from "components/create-collection-form/form-steps/GeneralInfoStep";
import { getLibrary } from "components/wallet/Wallet";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

const INITIAL_STATE: FormStateI = {
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: 0,
  static: { images: {} },
  generative: { layers: {} },
};

describe("GeneralInfoStep", () => {
  test("Page Number matches", () => {
    const tree = mount(
      <ThemeProvider>
        <NetworkProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <GeneralInfo
              pageNumber={0}
              state={INITIAL_STATE}
              handleCollNameChange={jest.fn()}
              handleDescriptionChange={jest.fn()}
              handleMintPriceChange={jest.fn()}
              handleSymbolChange={jest.fn()}
            />
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
            <GeneralInfo
              pageNumber={1}
              state={INITIAL_STATE}
              handleCollNameChange={jest.fn()}
              handleDescriptionChange={jest.fn()}
              handleMintPriceChange={jest.fn()}
              handleSymbolChange={jest.fn()}
            />
          </Web3ReactProvider>
        </NetworkProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
