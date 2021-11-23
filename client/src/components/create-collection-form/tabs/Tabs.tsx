import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Input from "components/common/Input";
import { useEffect, useState } from "react";
import { DEFAULT_MUI_DARK } from "utils/constants";
import getComponentByMode from "utils/getComponentByMode";
import TabPanel from "./TabPanel";

const INITIAL_VALUE = 0;

const tabsStyle = { borderRight: 1, borderColor: "divider" };
const nameInputStyle = { flexGrow: 1 };
const vTabsContainerStyle = {
  flexGrow: 1,
  bgcolor: "background.paper",
  display: "flex",
  height: "50vh",
  border: 1,
  borderRadius: 1,
};
const inputAndDeleteContainer = {
  gap: "10px",
  display: "flex",
  width: 1,
  alignItems: "center",
};

const accessibilityProps = (index: number) => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`,
});

interface PropsT {
  imgObjs: ImageT;
  NUMBER_OF_IMAGES: number;
  isLoading: boolean;
  handleImageDelete: (deleteId: string) => void;
  handleNameChange: (e: InputEventT, id: string) => void;
}

const VerticalTabs = ({
  NUMBER_OF_IMAGES,
  imgObjs,
  isLoading,
  handleImageDelete,
  handleNameChange,
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
            {...accessibilityProps(idx)}
          />
        ))}
      </Tabs>
      {Object.entries(imgObjs).map(([imgId, img], idx) => (
        <TabPanel key={imgId} value={value} index={idx}>
          <Box sx={inputAndDeleteContainer}>
            <Input
              sx={nameInputStyle}
              label="Name"
              value={img.name}
              placeholder="Enter a name for this NFT here"
              required
              inputProps={{ "data-testid": "nft-name-input" }}
              onChange={(e) => handleNameChange(e, imgId)}
            />
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
          <img width="100%" src={img.url} alt={img.image.name} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default VerticalTabs;
