import AvalancheLogo from "images/avalanche-logo.svg";
import BinanceLogo from "images/binance-logo.svg";
import CardanoLogo from "images/cardano-logo.svg";
import EthereumLogo from "images/ethereum-logo.svg";
import PolygonLogo from "images/polygon-logo.svg";
import SolanaLogo from "images/solana-logo.svg";

export const DEFAULT_MUI_ICON_SIZE = 24;
export const DEFAULT_ALERT_DURATION = 6000;
export const DEFAULT_ALERT_ELEVATION = 6;
export const DEFAULT_MUI_DARK = "#121212";
export const NAVBAR_HEIGHT = 90;

export const NETWORKS: NetworkT[] = [
  { name: "Ethereum", icon: EthereumLogo, chainId: 1 },
  { name: "Cardano", icon: CardanoLogo },
  { name: "Avalanche", icon: AvalancheLogo, chainId: 43114 },
  { name: "Solana", icon: SolanaLogo },
  { name: "Polygon", icon: PolygonLogo, chainId: 137 },
  { name: "BSC", icon: BinanceLogo, chainId: 56 },
];

export const DEFAULT_NET = {
  name: "Ethereum",
  icon: EthereumLogo,
  chainId: 1,
};

export const mainContainerStyle = {
  py: 3,
  width: 1,
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
  bgcolor: "background.default",
};
