import BrushIcon from "@mui/icons-material/Brush";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import { siderbarMenuItems } from "utils/constants";

interface PropsT {
  handleDrawerToggle: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const LinkBehavior = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link ref={ref} {...props} />
);
LinkBehavior.displayName = "link";

const SidebarMenu = ({ handleDrawerToggle }: PropsT): JSX.Element => {
  const { active, account } = useWeb3React();
  return (
    <Box
      width={250}
      role="presentation"
      display="flex"
      flexDirection="column"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}>
      <Typography
        gutterBottom
        component={Link}
        align="center"
        to="/"
        color="primary"
        variant="h5"
        sx={{ textDecoration: "none" }}
        noWrap
        mt={2}>
        NFToolkit
      </Typography>
      <Divider />
      <List>
        {siderbarMenuItems.map(({ text, location }, idx) => (
          <ListItem component={LinkBehavior} to={location} button key={idx}>
            <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
              <BrushIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        {active && (
          <ListItem component={LinkBehavior} to={`/${account}`} button>
            <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
              <CollectionsIcon />
            </ListItemIcon>
            <ListItemText primary={"My Collections"} />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default SidebarMenu;
