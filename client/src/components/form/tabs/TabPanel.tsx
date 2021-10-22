import { Box, SxProps, Theme } from "@mui/system";
import { ReactNode } from "react";

const tabPanelStyle = { width: 1, height: 1 };
const tabPanelBoxStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll",
  gap: 1,
  padding: 3,
  height: 1,
  width: 1,
};

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  const TABPANEL_ID = `vertical-tabpanel-${index}`;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={TABPANEL_ID}
      aria-labelledby={`vertical-tab-${index}`}
      sx={tabPanelStyle}
      {...other}>
      {value === index && <Box sx={tabPanelBoxStyle}>{children}</Box>}
    </Box>
  );
};

export default TabPanel;
