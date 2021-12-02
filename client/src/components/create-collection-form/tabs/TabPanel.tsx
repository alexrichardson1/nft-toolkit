import { Box, SxProps, Theme } from "@mui/system";
import { ReactNode } from "react";

const tabPanelStyle = { width: 1, height: 1 };
const tabPanelBoxStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  gap: "10px",
  padding: 3,
  height: 1,
  width: 1,
};

interface TabPanelProps {
  children?: ReactNode;
  vertical?: boolean;
  index: number;
  value: number;
}

/**
 * TabPanel to render contents of a tab if the tab is active
 * @param index - index of this tab
 * @param value - index of selected tab
 * @param vertical - true if vertical tabs, false otherwise
 * @param children - children nodes to render if index === value
 */
const TabPanel = ({
  vertical = false,
  children,
  value,
  index,
  ...other
}: TabPanelProps): JSX.Element => {
  const TABPANEL_ID = `${vertical ? "vertical-" : ""}tabpanel-${index}`;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={TABPANEL_ID}
      aria-labelledby={`${vertical ? "vertical-" : ""}-tab-${index}`}
      sx={tabPanelStyle}
      {...other}>
      {value === index && <Box sx={tabPanelBoxStyle}>{children}</Box>}
    </Box>
  );
};

export default TabPanel;
