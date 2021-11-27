import { createEvent, fireEvent, render } from "@testing-library/react";
import LayerImageUpload from "components/create-collection-form/form-steps/LayerImageUpload";
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

describe("LayerImageUpload snapshots", () => {
  test("Step Number and generative match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerImageUpload
          generative={true}
          isLoading={false}
          state={{
            ...INITIAL_STATE,
            generative: {
              numberOfTiers: 0,
              tiers: [],
              numberOfLayers: 1,
              layers: [
                {
                  name: "test-name",
                  numberOfImages: 0,
                  images: {},
                },
              ],
            },
          }}
          stepNumber={4}
          handleImgRarityChange={jest.fn()}
          handleLayerImgDelete={jest.fn()}
          handleLayerImgDrop={jest.fn()}
          handleLayerImgNameChange={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("Step Number does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerImageUpload
          generative={true}
          isLoading={true}
          state={{ ...INITIAL_STATE }}
          stepNumber={0}
          handleImgRarityChange={jest.fn()}
          handleLayerImgDelete={jest.fn()}
          handleLayerImgDrop={jest.fn()}
          handleLayerImgNameChange={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("generative does not match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerImageUpload
          generative={false}
          isLoading={true}
          state={{ ...INITIAL_STATE }}
          stepNumber={4}
          handleImgRarityChange={jest.fn()}
          handleLayerImgDelete={jest.fn()}
          handleLayerImgDrop={jest.fn()}
          handleLayerImgNameChange={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});

describe("LayerImageUpload unit tests", () => {
  test("Tabs change sets a new value", () => {
    const tree = render(
      <ThemeProvider>
        <LayerImageUpload
          generative={true}
          isLoading={false}
          state={{
            ...INITIAL_STATE,
            generative: {
              tiers: [],
              numberOfTiers: 0,
              numberOfLayers: 2,
              layers: [
                {
                  name: "test-name",
                  numberOfImages: 0,
                  images: {},
                },
                {
                  name: "test-name2",
                  numberOfImages: 0,
                  images: {},
                },
              ],
            },
          }}
          stepNumber={4}
          handleImgRarityChange={jest.fn()}
          handleLayerImgDelete={jest.fn()}
          handleLayerImgDrop={jest.fn()}
          handleLayerImgNameChange={jest.fn()}
        />
      </ThemeProvider>
    );
    const [, layer2Tab] = tree.getAllByRole("tab");
    if (layer2Tab) {
      const clickEvent = createEvent.click(layer2Tab);
      clickEvent.preventDefault = jest.fn();
      fireEvent(layer2Tab, clickEvent);
      expect(clickEvent.preventDefault).toHaveBeenCalled();
    } else {
      fail("There should atleast be 2 test images!");
    }
  });
});
