import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useState } from "react";
import { networks } from "common/constants";
import { useTheme } from "@mui/material/styles";

const containerStyle = {
  height: 60,
  width: 60,
};

const NETWORK_DIMENSIONS = "70%";

const actions = networks(NETWORK_DIMENSIONS);

const NetworkSpeedDial = (): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState(actions[0]);
  const theme = useTheme();

  const mainFabStyle = {
    border: "3px solid",
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.primary.main,
    "&:hover": {
      borderColor: theme.palette.secondary.main,
    },
  };

  const getSmallFabStyle = (network: NetworksT) => {
    if (!selectedNet || selectedNet.name !== network.name) {
      return { background: "white" };
    }
    return {
      border: "3px solid",
      background: "white",
      borderColor: theme.palette.primary.main,
    };
  };

  return (
    <Box sx={containerStyle}>
      <SpeedDial
        ariaLabel="network selection"
        direction="down"
        FabProps={{ sx: mainFabStyle }}
        icon={selectedNet ? selectedNet.icon : <AccountBalanceWalletIcon />}>
        {actions.map((network) => (
          <SpeedDialAction
            FabProps={{ sx: getSmallFabStyle(network) }}
            key={network.name}
            icon={network.icon}
            tooltipTitle={network.name}
            onClick={() => setSelectedNet(network)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default NetworkSpeedDial;
