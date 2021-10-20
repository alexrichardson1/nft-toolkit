import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { getComponentByMode } from "common/constants";

const tabPanelStyle = { padding: 3 };

const tabsStyle = { borderRight: 1, borderColor: "divider" };

const vTabsContainerStyle = {
  flexGrow: 1,
  bgcolor: "background.paper",
  display: "flex",
  height: 224,
  border: 1,
  borderRadius: 1,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={tabPanelStyle}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

interface PropsT {
  files: File[];
}

const VerticalTabs = (props: PropsT): JSX.Element => {
  const [value, setValue] = useState(0);

  const IMAGE_3 = 2;
  const IMAGE_4 = 3;
  const IMAGE_5 = 4;
  const IMAGE_6 = 5;

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
              getComponentByMode(theme.palette.mode, "#121212", "white"),
          },
        }}
        sx={tabsStyle}>
        <Tab label="Image 1" {...a11yProps(0)} />
        <Tab label="Image 2" {...a11yProps(1)} />
        <Tab label="Image 3" {...a11yProps(IMAGE_3)} />
        <Tab label="Image 4" {...a11yProps(IMAGE_4)} />
        <Tab label="Image 5" {...a11yProps(IMAGE_5)} />
        <Tab label="Image 6" {...a11yProps(IMAGE_6)} />
      </Tabs>
      {props.files.map((_file, idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          Image {idx}
        </TabPanel>
      ))}
      <TabPanel value={value} index={0}>
        Img One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Img Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Img Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Img Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Img Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Img Six
      </TabPanel>
    </Box>
  );
};

export default VerticalTabs;
