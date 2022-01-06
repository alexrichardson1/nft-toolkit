import { Tab } from "@mui/material";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import InfoToolTip from "components/common/InfoToolTip";
import Input from "components/common/Input";
import RarityProgressBar from "components/common/RarityProgressBar";
import { useState } from "react";
import { accessibilityProps, DEFAULT_MUI_DARK } from "utils/constants";
import getComponentByMode from "utils/getComponentByMode";
import { wrongStepGenerative } from "utils/pages";
import PageHeader from "../../common/PageHeader";
import ImageUploadWithTabs from "../ImageUploadWithTabs";
import TabPanel from "../tabs/TabPanel";

const LAYER_UPLOAD_PAGE_NUMBER = 3;
const INITIAL_VALUE = 0;

const layerImgUplContainerStyle = { width: "100%" };
const layerImgUplTabsStyle = { borderBottom: 1, borderColor: "divider" };

const SIZE_RECOMMENDATION = 0.9;

interface PropsT {
  stepNumber: number;
  state: FormStateI;
  generative: boolean;
  isLoading: boolean;
  handleLayerImgDelete: (deleteId: string, layerName?: string) => void;
  handleLayerImgDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null,
    layerName?: string
  ) => void;
  handleLayerImgNameChange: (
    e: InputEventT,
    imageid: string,
    layerName?: string
  ) => void;
  handleImgRarityChange: (
    layerName: string
  ) => (e: InputEventT, id: string) => void;
  handleQuantityChange: (e: InputEventT) => void;
}

/**
 * Step of the form where users can upload images for each layer of their
 * generative collection
 *
 * @param generative - true if user chose generative state, false otherwise
 * (must equal true for this page to render)
 * @param state - state of the form
 * @param stepNumber - current step the form is on
 * @param isLoading - true if form is in loading state, false otherwise
 * @param handleLayerImgDrop - handles image drop for layers
 * @param handleLayerImgDelete - handles image delete for layers
 * @param handleLayerImgNameChange - handles name changes for images in a layer
 */
const LayerImageUpload = ({
  generative,
  state,
  handleLayerImgDrop,
  handleLayerImgDelete,
  handleLayerImgNameChange,
  handleImgRarityChange,
  handleQuantityChange,
  stepNumber,
  isLoading,
}: PropsT): JSX.Element => {
  const [value, setValue] = useState(INITIAL_VALUE);

  if (wrongStepGenerative(generative, stepNumber, LAYER_UPLOAD_PAGE_NUMBER)) {
    return <></>;
  }

  const getMaxQuantity = (): number => {
    let max = 1;
    state.generative.layers.forEach((layer) => {
      if (layer.numberOfImages > 0) {
        max *= layer.numberOfImages + (layer.probability === "100" ? 0 : 1);
      } else {
        max = 0;
      }
    });
    return max;
  };

  const MAX_QUANTITY = getMaxQuantity();

  return (
    <>
      <PageHeader text="Upload Images for Each Layer" />
      <Box sx={layerImgUplContainerStyle}>
        <Box sx={layerImgUplTabsStyle}>
          <Tabs
            variant="scrollable"
            allowScrollButtonsMobile
            selectionFollowsFocus
            TabScrollButtonProps={{
              sx: {
                color: (theme) =>
                  getComponentByMode(
                    theme.palette.mode,
                    DEFAULT_MUI_DARK,
                    "white"
                  ),
              },
            }}
            aria-label="layer-tabs"
            value={value}
            onChange={(e, newValue) => {
              e.preventDefault();
              setValue(newValue);
            }}>
            {state.generative.layers.map((layer, idx) => {
              return (
                <Tab
                  key={layer.name}
                  label={layer.name}
                  {...accessibilityProps(idx)}
                />
              );
            })}
          </Tabs>
        </Box>
        {state.generative.layers.map((layer, idx) => {
          return (
            <TabPanel key={layer.name} value={value} index={idx}>
              <RarityProgressBar totalRarity={layer.totalImageRarities} />
              <ImageUploadWithTabs
                handleImgDelete={(deleteId) =>
                  handleLayerImgDelete(deleteId, layer.name)
                }
                handleImgDrop={(e, imgObjs) =>
                  handleLayerImgDrop(e, imgObjs, layer.name)
                }
                handleImgNameChange={(e, id) =>
                  handleLayerImgNameChange(e, id, layer.name)
                }
                handleImgRarityChange={handleImgRarityChange(layer.name)}
                NUMBER_OF_IMAGES={layer.numberOfImages}
                isLoading={isLoading}
                imgObjs={layer.images}
              />
            </TabPanel>
          );
        })}
      </Box>
      <Paper>
        <Input
          type="number"
          value={state.generative.quantity}
          onChange={handleQuantityChange}
          placeholder="0"
          label="Collection Quantity"
          InputProps={{
            inputProps: { min: Math.min(MAX_QUANTITY, 1), max: MAX_QUANTITY },
            endAdornment: (
              <InputAdornment position="end">
                <InfoToolTip
                  text={`Maximum possible amount of images that can be generated: ${MAX_QUANTITY}. We recommend generating up to ${Math.ceil(
                    SIZE_RECOMMENDATION * MAX_QUANTITY
                  )} images.`}
                />
              </InputAdornment>
            ),
          }}
          required
        />
      </Paper>
    </>
  );
};

export default LayerImageUpload;
