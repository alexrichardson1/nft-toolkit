import { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { ReactComponent as Ethereum } from "../../../images/ethereum-logo.svg";
import { ReactComponent as Cardano } from "../../../images/cardano-logo.svg";
import { ReactComponent as Polygon } from "../../../images/polygon-logo.svg";
import { ReactComponent as Solana } from "../../../images/solana-logo.svg";

const createIcon = (
  Component: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >
) => <Component width="70%" height="70%" />;

const actions = [
  {
    icon: createIcon(Ethereum),
    name: "Ethereum Network",
  },
  {
    icon: createIcon(Polygon),
    name: "Polygon Network",
  },
  {
    icon: createIcon(Solana),
    name: "Solana Network",
  },
  {
    icon: createIcon(Cardano),
    name: "Cardano Network",
  },
];

export default function OpenIconSpeedDial(): JSX.Element {
  const [selectedNet, setSelectedNet] = useState(actions[0]);
  // useEffect(, [selectedLogo])
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
}
