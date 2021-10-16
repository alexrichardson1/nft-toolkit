import { useState } from "react";
import OpenIconSpeedDial from "components/common/Networks";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Toolbar from "@mui/material/Toolbar";

const anchorOrigin: AnchorOriginType = { vertical: "top", horizontal: "right" };

const toolbarStyle = { justifyContent: "center", alignItems: "center" };

const moreIconContainerStyle = { display: { xs: "flex", md: "none" } };

const fabStyle = { padding: "15px", display: "flex", gap: "5px" };

const menuItemStyle = { display: "flex", gap: "5px" };

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
  const [mobileAnchorEl, setMobileAnchorEl] = useState<AnchorType>(null);

  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const MobileMenu = () => (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={anchorOrigin}
      id={"primary-menu-mobile"}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem sx={menuItemStyle} onClick={() => console.log("Clicked this")}>
        <AccountBalanceWalletIcon /> Connect Wallet
      </MenuItem>
    </Menu>
  );

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
              <AccountBalanceWalletIcon />
              Connect Wallet
            </Fab>
            <OpenIconSpeedDial />
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
      <MobileMenu />
    </Box>
  );
};

export default Navbar;
