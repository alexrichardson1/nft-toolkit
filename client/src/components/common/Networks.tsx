import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useState } from "react";
import { networks } from "common/constants";

const containerStyle = {
  height: 60,
  width: 60,
  transform: "translateZ(0px)",
  flexGrow: 1,
};

const NETWORK_DIMENSIONS = "70%";

const actions = networks(NETWORK_DIMENSIONS);

const NetworkSpeedDial = (): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState(actions[0]);

  return (
    <Box sx={containerStyle}>
      <SpeedDial
        ariaLabel="Network selection"
        direction="down"
        icon={selectedNet ? selectedNet.icon : <AccountBalanceWalletIcon />}>
        {actions.map((network) => (
          <SpeedDialAction
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
