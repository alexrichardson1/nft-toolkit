import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import NetworkContext from "context/network/NetworkContext";
import { useContext } from "react";
import { NETWORKS } from "utils/constants";
import SvgLogo from "./SvgLogo";

const NETWORK_DIMENSIONS = "70%";

const containerStyle = {
  height: 60,
  width: 60,
};
const mainFabStyle = {
  border: "3px solid",
  bgcolor: "background.default",
  borderColor: "primary.main",
  "&:hover": {
    borderColor: "secondary.main",
  },
};

const getSmallFabStyle = (network: NetworkT, selectedNetwork: NetworkT) => {
  if (selectedNetwork.name !== network.name) {
    return { background: "white" };
  }
  return {
    border: "3px solid",
    background: "white",
    borderColor: "primary.main",
  };
};

const NetworkSpeedDial = (): JSX.Element => {
  const { selectedNet, setSelectedNet } = useContext(NetworkContext);

  const speedDialIcon = (
    <SvgLogo
      icon={selectedNet.icon}
      width={NETWORK_DIMENSIONS}
      height={NETWORK_DIMENSIONS}
    />
  );

  return (
    <Box sx={containerStyle}>
      <SpeedDial
        ariaLabel="network selection"
        direction="down"
        FabProps={{ sx: mainFabStyle }}
        icon={speedDialIcon}>
        {NETWORKS.map((network) => (
          <SpeedDialAction
            FabProps={{ sx: getSmallFabStyle(network, selectedNet) }}
            key={network.name}
            icon={
              <SvgLogo
                icon={network.icon}
                width={NETWORK_DIMENSIONS}
                height={NETWORK_DIMENSIONS}
              />
            }
            data-testid={`${network.name}`}
            tooltipTitle={network.name}
            onClick={() => setSelectedNet(network)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default NetworkSpeedDial;
