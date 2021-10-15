import { useState } from "react";
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
import {
  MenuItemStyle,
  AppBarStyle,
  ToolbarStyle,
  OptionsStyle,
} from "./NavbarStyles";

const Navbar = (): JSX.Element => {
  const [mobileAnchorEl, setMobileAnchorEl] = useState<AnchorType>(null);

  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem sx={MenuItemStyle} onClick={() => console.log("Clicked this")}>
        <AccountBalanceWalletIcon /> Connect Wallet
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={AppBarStyle} position="sticky">
        <Toolbar sx={ToolbarStyle}>
          <Typography variant="h3" noWrap component="div">
            NFT-TOOLKIT
          </Typography>
          <Box flexGrow={1} />
          <Box sx={OptionsStyle}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              sx={{ padding: "15px", display: "flex", gap: "5px" }}>
              <AccountBalanceWalletIcon />
              Connect Wallet
            </Fab>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
};

export default Navbar;
