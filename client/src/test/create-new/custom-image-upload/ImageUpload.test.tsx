import { DAppProvider } from "@usedapp/core";
import ImageUpload from "components/create-new/custom-image-upload/ImageUpload";
import NetworkProvider from "context/network/NetworkProvider";
import ThemeProvider from "context/theme/ThemeProvider";
import { mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";

test("ImageUpload snapshot", () => {
  const toJson = EnzymeToJson;
  const tree = mount(
    <ThemeProvider>
      <NetworkProvider>
        <DAppProvider config={{}}>
          <ImageUpload
            imgObjs={[]}
            handleImageDrop={() => console.log("Image dropped into box")}
          />
        </DAppProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
  expect(toJson(tree)).toMatchSnapshot();
});
