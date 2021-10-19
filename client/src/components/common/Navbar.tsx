import NetworkSpeedDial from "components/common/Networks";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Toolbar from "@mui/material/Toolbar";
import MoreIcon from "@mui/icons-material/MoreVert";
import MobileMenu from "./MobileMenu";
import ThemeContext from "context/theme/ThemeContext";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useContext, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { getComponentByMode } from "common/constants";

const anchorOrigin: AnchorOriginType = { vertical: "top", horizontal: "right" };

const moreIconContainerStyle = { display: { xs: "flex", md: "none" } };

const extendedFabStyle = {
  display: "flex",
  gap: "7px",
  alignItems: "center",
  justifyCotnent: "center",
};

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
  background: (theme: Theme) => theme.palette.background.default,
  color: "text.primary",
  display: "flex",
  justifyContent: "center",
  height: 90,
};

const Navbar = (): JSX.Element => {
  const theme = useTheme();

  const { toggleColourMode } = useContext(ThemeContext);

  const [mobileAnchorEl, setMobileAnchorEl] = useState<AnchorType>(null);

  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const handleMobileMenuClose = () => setMobileAnchorEl(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileAnchorEl(event.currentTarget);

  const getThemeIcon = () =>
    getComponentByMode(
      theme.palette.mode,
      <NightsStayIcon fontSize="large" />,
      <Brightness7Icon fontSize="large" />
    );

  return (
    <Box flexGrow={1}>
      <AppBar sx={appBarStyle} position="sticky">
        <Toolbar sx={toolbarStyle}>
          <Typography color="primary" variant="h3" noWrap component="div">
            NFToolkit
          </Typography>
          <Box flexGrow={1} />
          <Box sx={navOptionsStyle}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="connect wallet"
              sx={extendedFabStyle}>
              <AccountBalanceWalletIcon />
              <Typography>Connect Wallet</Typography>
            </Fab>
            <NetworkSpeedDial />
            <Fab onClick={toggleColourMode}>{getThemeIcon()}</Fab>
          </Box>
          <Box sx={moreIconContainerStyle}>
            <IconButton onClick={toggleColourMode}>{getThemeIcon()}</IconButton>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={"primary-menu-mobile"}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        anchOrigin={anchorOrigin}
        anchorEl={mobileAnchorEl}
        handleClose={handleMobileMenuClose}
      />
    </Box>
  );
};

export default Navbar;
