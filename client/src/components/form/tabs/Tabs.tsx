import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { DEFAULT_MUI_DARK } from "utils/constants";
import { getComponentByMode } from "utils/getComponentByMode";
import Input from "../Input";
import TabPanel from "./TabPanel";

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
  width: "100%",
  alignItems: "center",
};
const accessibilityProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

interface PropsT {
  files: ImageListT;
  dispatch: React.Dispatch<FormActionI>;
}

const VerticalTabs = (props: PropsT): JSX.Element => {
  const [value, setValue] = useState(0);
  const handleImageDelete = (deleteId: string) => {
    props.dispatch({ type: "DELETE_IMAGE", payload: { deleteId } });
  };
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) =>
    props.dispatch({
      type: "CHANGE_IMAGE_NAME",
      payload: {
        newImageObj: {
          newImageName: e.target.value,
          imageId: id,
        },
      },
    });

  return (
    <Box sx={vTabsContainerStyle}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        allowScrollButtonsMobile
        selectionFollowsFocus
        value={value}
        onChange={(_e, newValue) => setValue(newValue)}
        TabScrollButtonProps={{
          sx: {
            color: (theme) =>
              getComponentByMode(theme.palette.mode, DEFAULT_MUI_DARK, "white"),
          },
        }}
        sx={tabsStyle}>
        {props.files.map((image, idx) => (
          <Tab
            key={image.id}
            label={`Image ${idx + 1}`}
            {...accessibilityProps(idx)}
          />
        ))}
      </Tabs>

      {props.files.map((image, idx) => (
        <TabPanel key={image.id} value={value} index={idx}>
          <Box sx={inputAndDeleteContainer}>
            <Input
              sx={nameInputStyle}
              label="Name"
              value={image.name}
              placeholder="Enter name for NFT here"
              required
              onChange={(e) => handleNameChange(e, image.id)}
            />
            <IconButton onClick={() => handleImageDelete(image.id)}>
              <DeleteIcon fontSize="large" color="error" />
            </IconButton>
          </Box>

          <img
            height="100%"
            width="100%"
            src={image.url}
            alt="uploaded_image"
          />
        </TabPanel>
      ))}
    </Box>
  );
};

export default VerticalTabs;
