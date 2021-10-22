import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { PopoverOrigin, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NetworkContext from "context/network/NetworkContext";
import { useContext, useState } from "react";
import { DEFAULT_MUI_ICON_SIZE, NETWORKS } from "utils/constants";
import SvgLogo from "./SvgLogo";

const menuItemStyle = { display: "flex", gap: "5px" };

interface PropsT {
  isOpen: boolean;
  anchorEl: AnchorT;
  anchOrigin: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  handleClose: () => void;
}

const MobileMenu = (props: PropsT): JSX.Element => {
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
        anchorEl={props.anchorEl}
        anchorOrigin={props.anchOrigin}
        transformOrigin={props.transformOrigin ?? props.anchOrigin}
        id={MOBILE_MENU_ID}
        keepMounted
        open={props.isOpen}
        onClose={props.handleClose}>
        <MenuItem
          sx={menuItemStyle}
          onClick={() => console.log("Clicked this")}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography>Connect Wallet</Typography>
        </MenuItem>

        <MenuItem sx={menuItemStyle} onClick={handleNetworkMenuOpen}>
          <SvgLogo
            icon={selectedNet.icon}
            width={DEFAULT_MUI_ICON_SIZE}
            height={DEFAULT_MUI_ICON_SIZE}
          />
          <Typography>{selectedNet.name}</Typography>
        </MenuItem>
      </Menu>

      <Menu
        keepMounted
        anchorOrigin={props.anchOrigin}
        transformOrigin={props.transformOrigin ?? props.anchOrigin}
        onClose={handleNetworkMenuClose}
        anchorEl={networkAnchorEl}
        open={IS_NET_MENU_OPEN}>
        {NETWORKS.map((network) => (
          <MenuItem
            onClick={() => handleNetworkChange(network)}
            key={network.name}
            sx={menuItemStyle}>
            <SvgLogo
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
