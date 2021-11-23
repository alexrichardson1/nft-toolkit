import { Tab } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { wrongStepGenerative } from "utils/pages";
import ImageUploadWithTabs from "../ImageUploadWithTabs";
import TabPanel from "../tabs/TabPanel";

const LAYER_UPLOAD_PAGE_NUMBER = 3;
const INITIAL_VALUE = 0;

interface PropsT {
  stepNumber: number;
  state: FormStateI;
  generative: boolean;
  isLoading: boolean;
  handleLayerImgDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null,
    layerId?: string
  ) => void;
  handleLayerImgDelete: (deleteId: string, layerId?: string) => void;
  handleLayerImgNameChange: (
    e: InputEventT,
    imageid: string,
    layerId?: string
  ) => void;
}

const LayerImageUpload = ({
  generative,
  state,
  handleLayerImgDrop,
  handleLayerImgDelete,
  handleLayerImgNameChange,
  stepNumber,
  isLoading,
}: PropsT): JSX.Element => {
  if (wrongStepGenerative(generative, stepNumber, LAYER_UPLOAD_PAGE_NUMBER)) {
    return <></>;
  }

  const [value, setValue] = useState(INITIAL_VALUE);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          aria-label="layer-tabs"
          value={value}
          onChange={(_e, newValue) => setValue(newValue)}>
          {state.generative.layers.map((layer) => {
            return <Tab key={layer.layerId} label={layer.name} />;
          })}
        </Tabs>
      </Box>
      {state.generative.layers.map((layer, idx) => {
        return (
          <TabPanel key={layer.layerId} value={value} index={idx}>
            <ImageUploadWithTabs
              handleImgDelete={(deleteId) =>
                handleLayerImgDelete(deleteId, layer.layerId)
              }
              handleImgDrop={(e, imgObjs) =>
                handleLayerImgDrop(e, imgObjs, layer.layerId)
              }
              handleImgNameChange={(e, id) =>
                handleLayerImgNameChange(e, id, layer.layerId)
              }
              NUMBER_OF_IMAGES={layer.numberOfImages}
              isLoading={isLoading}
              imgObjs={layer.images}
            />
          </TabPanel>
        );
      })}
    </Box>
  );
};

export default LayerImageUpload;
