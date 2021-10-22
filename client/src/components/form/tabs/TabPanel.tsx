import { Box, SxProps, Theme } from "@mui/system";
import { ReactNode } from "react";

const tabPanelStyle = { width: "100%", height: "100%" };

const tabPanelBoxStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
  padding: 3,
  height: "100%",
  width: "100%",
  overflowY: "scroll",
};

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={tabPanelStyle}
      {...other}>
      {value === index && <Box sx={tabPanelBoxStyle}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
