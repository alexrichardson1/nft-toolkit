import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MoreIcon from "@mui/icons-material/MoreVert";
import { PopoverOrigin } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NetworkSpeedDial from "components/common/Networks";
import Wallet from "components/wallet/Wallet";
import ThemeContext from "context/theme/ThemeContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { NAVBAR_HEIGHT } from "utils/constants";
import getComponentByMode from "utils/getComponentByMode";
import MobileMenu from "../common/MobileMenu";

const MENU_ANCHOR_ORIGIN: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};

const moreIconContainerStyle = { display: { xs: "flex", md: "none" } };

const toolbarStyle = {
  width: 1,
  height: 1,
  justifyContent: "center",
  alignItems: "center",
};
const navOptionsStyle = {
  display: { xs: "none", md: "flex" },
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
};
const appBarStyle = {
  bgcolor: "background.default",
  color: "text.primary",
  display: "flex",
  justifyContent: "center",
  height: NAVBAR_HEIGHT,
};

const Navbar = (): JSX.Element => {
  const theme = useTheme();
  const { toggleColourMode } = useContext(ThemeContext);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<AnchorT>(null);

  const handleMobileMenuClose = () => setMobileAnchorEl(null);
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileAnchorEl(event.currentTarget);

  const getThemeIcon = () =>
    getComponentByMode(
      theme.palette.mode,
      <DarkModeIcon fontSize="large" />,
      <LightModeIcon fontSize="large" />
    );

  const IS_MOBILE_MENU_OPEN = Boolean(mobileAnchorEl);

  const navOptions = (
    <Box sx={navOptionsStyle}>
      <Wallet />
      <NetworkSpeedDial />
      <Fab id="theme-change-btn" onClick={toggleColourMode}>
        {getThemeIcon()}
      </Fab>
    </Box>
  );

  const moreOptionsIcon = (
    <Box sx={moreIconContainerStyle}>
      <IconButton onClick={toggleColourMode}>{getThemeIcon()}</IconButton>
      <IconButton
        size="large"
        aria-label="show more"
        aria-controls="primary-menu-mobile"
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
        color="inherit">
        <MoreIcon fontSize="large" />
      </IconButton>
    </Box>
  );

  return (
    <Box flexGrow={1}>
      <AppBar sx={appBarStyle} position="sticky">
        <Toolbar sx={toolbarStyle}>
          <Typography
            sx={{ textDecoration: "none" }}
            component={Link}
            to="/"
            color="primary"
            variant="h3"
            noWrap>
            NFToolkit
          </Typography>
          <Box flexGrow={1} />
          {navOptions}
          {moreOptionsIcon}
        </Toolbar>
      </AppBar>
      <MobileMenu
        isOpen={IS_MOBILE_MENU_OPEN}
        anchOrigin={MENU_ANCHOR_ORIGIN}
        anchorEl={mobileAnchorEl}
        handleClose={handleMobileMenuClose}
      />
    </Box>
  );
};

export default Navbar;
