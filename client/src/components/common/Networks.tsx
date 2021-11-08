import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useWeb3React } from "@web3-react/core";
import { switchChain } from "components/wallet/walletUtils";
import NetworkContext from "context/network/NetworkContext";
import SnackbarContext from "context/snackbar/SnackbarContext";
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
  const { showSnackbar } = useContext(SnackbarContext);
  const { library } = useWeb3React();

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
            onClick={() =>
              switchChain(network, library, setSelectedNet, showSnackbar)
            }
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default NetworkSpeedDial;
