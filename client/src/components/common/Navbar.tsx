import { useContext, useState } from "react";
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
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const anchorOrigin: AnchorOriginType = { vertical: "top", horizontal: "right" };

const toolbarStyle = { justifyContent: "center", alignItems: "center" };

const moreIconContainerStyle = { display: { xs: "flex", md: "none" } };

const fabStyle = { padding: "15px", display: "flex", gap: "5px" };

const appBarStyle = {
  height: "80px",
  display: "flex",
  justifyContent: "center",
};

const optionsStyle = {
  display: { xs: "none", md: "flex" },
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
};

const Navbar = (): JSX.Element => {
  const theme = useTheme();
  const { toggleColourMode } = useContext(ThemeContext);

  const [mobileAnchorEl, setMobileAnchorEl] = useState<AnchorType>(null);

  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  return (
    <Box flexGrow={1}>
      <AppBar sx={appBarStyle} position="sticky">
        <Toolbar sx={toolbarStyle}>
          <Typography variant="h4" noWrap component="div">
            NFTit
          </Typography>
          <Box flexGrow={1} />
          <Box sx={optionsStyle}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              sx={fabStyle}>
              <AccountBalanceWalletIcon color="secondary" />
              <Typography>Connect Wallet</Typography>
            </Fab>
            <NetworkSpeedDial />
            <IconButton onClick={toggleColourMode}>
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon color="success" fontSize="large" />
              ) : (
                <Brightness4Icon color="error" fontSize="large" />
              )}
            </IconButton>
          </Box>
          <Box sx={moreIconContainerStyle}>
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
