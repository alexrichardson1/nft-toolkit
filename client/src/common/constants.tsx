import EthereumLogo from "images/ethereum-logo.svg";
import CardanoLogo from "images/cardano-logo.svg";
import PolygonLogo from "images/polygon-logo.svg";
import SolanaLogo from "images/solana-logo.svg";
import BinanceLogo from "images/binance-logo.svg";
import AvalancheLogo from "images/avalanche-logo.svg";
import SvgLogo from "components/common/SvgLogo";
import { PaletteMode } from "@mui/material";

export const DEFAULT_MUI_ICON_SIZE = 24;

export const networkLogos = [
  EthereumLogo,
  CardanoLogo,
  AvalancheLogo,
  SolanaLogo,
  PolygonLogo,
  BinanceLogo,
];

export const networkNames = [
  "Ethereum",
  "Cardano",
  "Avalanche",
  "Solana",
  "Polygon",
  "BSC",
];

export const getNetworkFromName = (
  network: string,
  dimensions: string | number
): NetworksT => {
  switch (network) {
    case "Cardano":
      return {
        icon: (
          <SvgLogo icon={CardanoLogo} width={dimensions} height={dimensions} />
        ),
        name: "Cardano",
      };
    case "Avalanche":
      return {
        icon: (
          <SvgLogo
            icon={AvalancheLogo}
            width={dimensions}
            height={dimensions}
          />
        ),
        name: "Avalanche",
      };
    case "Solana":
      return {
        icon: (
          <SvgLogo icon={SolanaLogo} width={dimensions} height={dimensions} />
        ),
        name: "Solana",
      };
    case "Polygon":
      return {
        icon: (
          <SvgLogo icon={PolygonLogo} width={dimensions} height={dimensions} />
        ),
        name: "Polygon",
      };
    case "BSC":
      return {
        icon: (
          <SvgLogo icon={BinanceLogo} width={dimensions} height={dimensions} />
        ),
        name: "BSC",
      };
    default:
      return {
        icon: (
          <SvgLogo icon={EthereumLogo} width={dimensions} height={dimensions} />
        ),
        name: "Ethereum",
      };
  }
};

export const networks = (dimensions: string | number): NetworksT[] =>
  networkLogos.map((logo, index) => {
    return {
      icon: <SvgLogo icon={logo} width={dimensions} height={dimensions} />,
      name: networkNames[index] || "",
    };
  });

export const getComponentByMode = <T,>(
  mode: PaletteMode,
  lightComponent: T,
  darkComponent: T
): T => {
  if (mode === "light") {
    return lightComponent;
  }
  return darkComponent;
};

export const mainContainerStyle = {
  py: 3,
  width: 1,
  minHeight: "calc(100vh - 91px)",
  bgcolor: "background.default",
};
