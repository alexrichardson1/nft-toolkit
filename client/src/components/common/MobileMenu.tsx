import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const menuItemStyle = { display: "flex", gap: "5px" };

interface PropsT {
  isOpen: boolean;
  anchorEl: AnchorType;
  anchOrigin: AnchorOriginType;
  transformOrigin?: AnchorOriginType;
  handleClose: () => void;
}

const MobileMenu = (props: PropsT): JSX.Element => (
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
    <MenuItem sx={menuItemStyle} onClick={() => console.log("Clicked this")}>
      <AccountBalanceWalletIcon /> Connect Wallet
    </MenuItem>
  </Menu>
);

export default MobileMenu;
