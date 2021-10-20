import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useContext, useState } from "react";
import { Typography } from "@mui/material";
import NetworkContext from "context/network/NetworkContext";
import {
  DEFAULT_MUI_ICON_SIZE,
  getNetworkFromName,
  networks,
} from "utils/constants";

const menuItemStyle = { display: "flex", gap: "5px" };

const networkList = networks(DEFAULT_MUI_ICON_SIZE);

interface PropsT {
  isOpen: boolean;
  anchorEl: AnchorType;
  anchOrigin: AnchorOriginType;
  transformOrigin?: AnchorOriginType;
  handleClose: () => void;
}

const MobileMenu = (props: PropsT): JSX.Element => {
  const { selectedNet, setSelectedNet } = useContext(NetworkContext);
  const [networkAnchorEl, setNetworkAnchorEl] = useState<AnchorType>(null);

  const selectedNetwork = getNetworkFromName(
    selectedNet,
    DEFAULT_MUI_ICON_SIZE
  );

  const isNetworkMenuOpen = Boolean(networkAnchorEl);

  const handleNetworkMenuClose = () => setNetworkAnchorEl(null);

  const handleNetworkMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setNetworkAnchorEl(event.currentTarget);

  const handleNetworkChange = (network: NetworksT) => {
    setSelectedNet(network.name);
    handleNetworkMenuClose();
  };

  return (
    <>
      <Menu
        anchorEl={props.anchorEl}
        anchorOrigin={props.anchOrigin}
        transformOrigin={
          props.transformOrigin ? props.transformOrigin : props.anchOrigin
        }
        id={"primary-menu-mobile"}
        keepMounted
        open={props.isOpen}
        onClose={props.handleClose}>
        <MenuItem
          sx={menuItemStyle}
          onClick={() => console.log("Clicked this")}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography>Connect Wallet</Typography>
        </MenuItem>
        {selectedNetwork && (
          <MenuItem sx={menuItemStyle} onClick={handleNetworkMenuOpen}>
            {selectedNetwork.icon}
            <Typography>{selectedNetwork.name}</Typography>
          </MenuItem>
        )}
      </Menu>
      <Menu
        keepMounted
        anchorOrigin={props.anchOrigin}
        transformOrigin={
          props.transformOrigin ? props.transformOrigin : props.anchOrigin
        }
        onClose={handleNetworkMenuClose}
        anchorEl={networkAnchorEl}
        open={isNetworkMenuOpen}>
        {networkList.map((network) => (
          <MenuItem
            onClick={() => handleNetworkChange(network)}
            key={network.name}
            sx={menuItemStyle}>
            {network.icon}
            <Typography>{network.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MobileMenu;
