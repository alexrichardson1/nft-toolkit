import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// import { ReactComponent as Ethereum } from "../../../images/ethereum-logo.svg";
import { ReactComponent as Ethereum } from "../../../images/ethereum-logo.svg";
import { ReactComponent as Cardano } from "../../../images/cardano-logo.svg";
import { ReactComponent as Polygon } from "../../../images/polygon-logo.svg";
import { ReactComponent as Solana } from "../../../images/solana-logo.svg";

const actions = [
  {
    icon: <Ethereum width="70%" height="70%" />,
    name: "Ethereum Network",
  },
  {
    icon: <Polygon width="70%" height="70%" />,
    name: "Polygon Network",
  },
  {
    icon: <Solana width="70%" height="70%" />,
    name: "Solana Network",
  },
  {
    icon: <Cardano width="70%" height="70%" />,
    name: "Cardano Network",
  },
];

export default function OpenIconSpeedDial(): JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        height: "60px",
        width: "60px",
        transform: "translateZ(0px)",
        flexGrow: 1,
      }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: "absolute", top: 0 }}
        direction={"down"}
        icon={<Polygon width="70%" height="70%" />}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
