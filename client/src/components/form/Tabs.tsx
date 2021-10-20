import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { getComponentByMode } from "common/constants";
import Grid from "@mui/material/Grid";

const tabPanelStyle = { padding: 3 };

const tabsStyle = { borderRight: 1, borderColor: "divider" };

const vTabsContainerStyle = {
  flexGrow: 1,
  bgcolor: "background.paper",
  display: "flex",
  height: "50vh",
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
  files: ImageListT;
}

const VerticalTabs = (props: PropsT): JSX.Element => {
  const [value, setValue] = useState(0);

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
        {props.files.map((_image, idx) => (
          <Tab key={idx} label={`Image ${idx + 1}`} {...a11yProps(idx)} />
        ))}
      </Tabs>
      {props.files.map((file, idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column">
            <Grid item xs={4}>
              Something here
            </Grid>
            <Grid item xs={8}>
              <img
                height="100vh"
                width="100%"
                src={file.url}
                alt="uploaded_image"
              />
            </Grid>
          </Grid>
        </TabPanel>
      ))}
    </Box>
  );
};

export default VerticalTabs;
