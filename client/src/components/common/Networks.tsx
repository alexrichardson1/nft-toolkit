import { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SvgLogo from "components/common/SvgLogo";
import { logos, names } from "common/constants";

const containerStyle = {
  height: "60px",
  width: "60px",
  transform: "translateZ(0px)",
  flexGrow: 1,
};

const NetworkDimensions = "70%";

const actions: { icon: JSX.Element; name: string }[] = logos.map(
  (logo, index) => {
    return {
      icon: (
        <SvgLogo
          logo={logo}
          width={NetworkDimensions}
          height={NetworkDimensions}
        />
      ),
      name: names[index],
    };
  }
);

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
