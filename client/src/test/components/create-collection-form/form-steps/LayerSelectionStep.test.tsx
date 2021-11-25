import LayerSelectionStep from "components/create-collection-form/form-steps/LayerSelectionStep";
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

describe("LayerSelectionStep snapshots", () => {
  test("Page Number and generative matche", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerSelectionStep
          generative={true}
          state={{
            ...INITIAL_STATE,
            generative: {
              numberOfLayers: 1,
              layers: [
                {
                  layerId: "test-id",
                  name: "test-name",
                  numberOfImages: 0,
                  images: {},
                },
              ],
            },
          }}
          stepNumber={2}
          handleLayerAddition={jest.fn()}
          handleLayerRemoval={jest.fn()}
          handleLayerReorder={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("Page Number does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerSelectionStep
          generative={true}
          state={{ ...INITIAL_STATE }}
          stepNumber={0}
          handleLayerAddition={jest.fn()}
          handleLayerRemoval={jest.fn()}
          handleLayerReorder={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("generative does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerSelectionStep
          generative={false}
          state={{ ...INITIAL_STATE }}
          stepNumber={2}
          handleLayerAddition={jest.fn()}
          handleLayerRemoval={jest.fn()}
          handleLayerReorder={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
