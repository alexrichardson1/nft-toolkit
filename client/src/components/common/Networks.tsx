import { useState } from "react";
import { networkLogos, networkNames } from "common/constants";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SvgLogo from "components/common/SvgLogo";

const containerStyle = {
  height: 60,
  width: 60,
  transform: "translateZ(0px)",
  flexGrow: 1,
};

const NetworkDimensions = "70%";

const actions: SpeedDialActions[] = networkLogos.map((logo, index) => {
  return {
    icon: (
      <SvgLogo
        icon={logo}
        width={NetworkDimensions}
        height={NetworkDimensions}
      />
    ),
    name: networkNames[index],
  };
});

const OpenIconSpeedDial = (): JSX.Element => {
  const [selectedNet, setSelectedNet] = useState(actions[0]);

  return (
    <Box sx={containerStyle}>
      <SpeedDial
        ariaLabel="Network selection"
        direction="down"
        icon={selectedNet.icon}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => setSelectedNet(action)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default OpenIconSpeedDial;
