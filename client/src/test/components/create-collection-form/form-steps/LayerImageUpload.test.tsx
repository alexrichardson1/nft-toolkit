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
  generative: { layers: [], numberOfLayers: 0 },
};

describe("LayerImageUpload snapshots", () => {
  test("Page Number and generative match", () => {
    const tree = mount(
      <ThemeProvider>
        <LayerImageUpload
          generative={true}
          isLoading={false}
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
          stepNumber={3}
          handleImgRarityChange={jest.fn()}
          handleLayerImgDelete={jest.fn()}
          handleLayerImgDrop={jest.fn()}
          handleLayerImgNameChange={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  test("Page Number does not match", () => {
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
          stepNumber={3}
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
              numberOfLayers: 2,
              layers: [
                {
                  layerId: "test-id",
                  name: "test-name",
                  numberOfImages: 0,
                  images: {},
                },
                {
                  layerId: "test-id2",
                  name: "test-name2",
                  numberOfImages: 0,
                  images: {},
                },
              ],
            },
          }}
          stepNumber={3}
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
