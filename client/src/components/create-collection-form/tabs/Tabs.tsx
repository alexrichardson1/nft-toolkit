import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InfoTooltip from "components/common/InfoToolTip";
import Input from "components/common/Input";
import { useEffect, useState } from "react";
import { accessibilityProps, DEFAULT_MUI_DARK } from "utils/constants";
import getComponentByMode from "utils/getComponentByMode";
import TabPanel from "./TabPanel";

const INITIAL_VALUE = 0;

const tabsStyle = { borderRight: 1, borderColor: "divider" };
const vTabsContainerStyle = {
  flexGrow: 1,
  bgcolor: "background.paper",
  display: "flex",
  height: "60vh",
  border: 1,
  borderRadius: 1,
};
const inputAndDeleteContainer = {
  gap: "10px",
  display: "flex",
  width: 1,
  alignItems: "center",
};

interface PropsT {
  imgObjs: ImageT;
  NUMBER_OF_IMAGES: number;
  isLoading: boolean;
  handleImageDelete: (deleteId: string) => void;
  handleNameChange: (e: InputEventT, id: string) => void;
  handleImgDescChange?: (e: InputEventT, id: string) => void;
  handleImgRarityChange?: (e: InputEventT, id: string) => void;
}

/**
 *
 * Renders a vertical tabs component
 *
 * @param imgObjs - image objects to render
 * @param NUMBER_OF_IMAGES - number of images
 * @param isLoading - true if form is in loading state, false otherwise
 * @param handleImageDelete - handles image delete
 * @param handleImgDescChange - handles image description change
 * @param handleNameChange - handles image name change
 * @param handleImgRarityChange - handles change in rarity of an image
 */

const VerticalTabs = ({
  NUMBER_OF_IMAGES,
  imgObjs,
  isLoading,
  handleImageDelete,
  handleNameChange,
  handleImgDescChange,
  handleImgRarityChange,
}: PropsT): JSX.Element => {
  const [value, setValue] = useState(INITIAL_VALUE);

  useEffect(() => {
    if (value >= NUMBER_OF_IMAGES) {
      setValue(NUMBER_OF_IMAGES - 1);
    }
  }, [NUMBER_OF_IMAGES, value]);

  return (
    <Box sx={vTabsContainerStyle}>
      <Tabs
        orientation="vertical"
        data-testid="tabs"
        variant="scrollable"
        allowScrollButtonsMobile
        selectionFollowsFocus
        value={value < NUMBER_OF_IMAGES ? value : NUMBER_OF_IMAGES - 1}
        onChange={(e, newValue) => {
          e.preventDefault();
          setValue(newValue);
        }}
        TabScrollButtonProps={{
          sx: {
            color: (theme) =>
              getComponentByMode(theme.palette.mode, DEFAULT_MUI_DARK, "white"),
          },
        }}
        sx={tabsStyle}>
        {Object.keys(imgObjs).map((imgId, idx) => (
          <Tab
            key={imgId}
            label={`Image ${idx + 1}`}
            {...accessibilityProps(idx, true)}
          />
        ))}
      </Tabs>
      {Object.entries(imgObjs).map(([imgId, img], idx) => (
        <TabPanel vertical key={imgId} value={value} index={idx}>
          <Box sx={inputAndDeleteContainer}>
            <Input
              label="Name"
              value={img.name}
              placeholder="Enter a name for this NFT here"
              inputProps={{ "data-testid": "nft-name-input" }}
              onChange={(e) => handleNameChange(e, imgId)}
            />
            {typeof handleImgRarityChange !== "undefined" && (
              <Input
                type="number"
                InputProps={{
                  inputProps: { min: 1, max: 100, step: 1 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <InfoTooltip
                        text="Add an associated likelihood ranging from 0 (Impossible) to 100 (Guaranteed) 
                      for the chance that this image is randomly minted for this layer."
                      />
                    </InputAdornment>
                  ),
                }}
                label="Likelihood (0 to 100)"
                value={img.rarity}
                required
                placeholder="0"
                inputProps={{ "data-testid": "nft-rarity-input" }}
                onChange={(e) => handleImgRarityChange(e, imgId)}
              />
            )}
            <IconButton
              disabled={isLoading}
              data-testid="delete-icon"
              onClick={() => handleImageDelete(imgId)}>
              <DeleteIcon
                fontSize="large"
                color={isLoading ? "disabled" : "error"}
              />
            </IconButton>
          </Box>
          {typeof handleImgDescChange !== "undefined" && (
            <Input
              onChange={(e) => handleImgDescChange(e, imgId)}
              label="Description"
              placeholder="Enter a description for this image"
              inputProps={{ "data-testid": "nft-description-input" }}
              value={img.description}
            />
          )}
          <img width="100%" src={img.url} alt={img.image.name} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default VerticalTabs;
