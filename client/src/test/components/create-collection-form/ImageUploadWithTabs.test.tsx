import ImageUploadWithTabs from "components/create-collection-form/ImageUploadWithTabs";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";

describe("OrderableListItem snapshots", () => {
  test("isLoading", () => {
    const tree = mount(
      <ThemeProvider>
        <ImageUploadWithTabs
          NUMBER_OF_IMAGES={0}
          handleImgDelete={jest.fn()}
          handleImgDescChange={jest.fn()}
          handleImgNameChange={jest.fn()}
          handleImgDrop={jest.fn()}
          handleImgRarityChange={jest.fn()}
          isLoading={true}
          imgObjs={{}}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
