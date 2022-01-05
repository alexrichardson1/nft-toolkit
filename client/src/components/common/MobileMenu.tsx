import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { PopoverOrigin, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NetworkContext from "context/network/NetworkContext";
import { useContext, useState } from "react";
import { DEFAULT_MUI_ICON_SIZE, NETWORKS } from "utils/constants";
import SvgIcon from "./SvgLogo";

const menuItemStyle = { display: "flex", gap: "5px" };

interface PropsT {
  isOpen: boolean;
  anchorEl: AnchorT;
  anchOrigin: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  handleClose: () => void;
}

const MobileMenu = ({
  isOpen,
  anchorEl,
  anchOrigin,
  transformOrigin,
  handleClose,
}: PropsT): JSX.Element => {
  const { selectedNet, setSelectedNet } = useContext(NetworkContext);
  const [networkAnchorEl, setNetworkAnchorEl] = useState<AnchorT>(null);

  const handleNetworkMenuClose = () => setNetworkAnchorEl(null);
  const handleNetworkMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setNetworkAnchorEl(event.currentTarget);
  const handleNetworkChange = (network: NetworkT) => {
    setSelectedNet(network);
    handleNetworkMenuClose();
  };

  const IS_NET_MENU_OPEN = Boolean(networkAnchorEl);
  const MOBILE_MENU_ID = "primary-menu-mobile";

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={anchOrigin}
        transformOrigin={transformOrigin ?? anchOrigin}
        id={MOBILE_MENU_ID}
        keepMounted
        open={isOpen}
        onClose={handleClose}>
        <MenuItem sx={menuItemStyle}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography>Connect Wallet</Typography>
        </MenuItem>

        <MenuItem
          sx={menuItemStyle}
          data-testid="menuItemMobile"
          onClick={handleNetworkMenuOpen}>
          <SvgIcon
            icon={selectedNet.icon}
            width={DEFAULT_MUI_ICON_SIZE}
            height={DEFAULT_MUI_ICON_SIZE}
            alt={selectedNet.name}
          />
          <Typography>{selectedNet.name}</Typography>
        </MenuItem>
      </Menu>

      <Menu
        keepMounted
        anchorOrigin={anchOrigin}
        transformOrigin={transformOrigin ?? anchOrigin}
        onClose={handleNetworkMenuClose}
        anchorEl={networkAnchorEl}
        open={IS_NET_MENU_OPEN}>
        {NETWORKS.map((network) => (
          <MenuItem
            onClick={() => handleNetworkChange(network)}
            key={network.name}
            data-testid={`${network.name.toLowerCase()}-mobile-option`}
            sx={menuItemStyle}>
            <SvgIcon
              alt={network.name}
              icon={network.icon}
              width={DEFAULT_MUI_ICON_SIZE}
              height={DEFAULT_MUI_ICON_SIZE}
            />
            <Typography>{network.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MobileMenu;
