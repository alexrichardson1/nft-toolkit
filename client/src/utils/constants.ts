import { S3 } from "aws-sdk";
import AvalancheLogo from "images/avalanche-logo.svg";
import BinanceLogo from "images/binance-logo.svg";
import EthereumLogo from "images/ethereum-logo.svg";
import PolygonLogo from "images/polygon-logo.svg";

export const DEFAULT_PADDING = 3;
export const DEFAULT_GAP = "10px";
export const DEFAULT_MUI_ICON_SIZE = 24;
export const DEFAULT_ALERT_DURATION = 6000;
export const DEFAULT_ALERT_ELEVATION = 6;
export const DEFAULT_MUI_DARK = "#121212";
export const NAVBAR_HEIGHT = 90;

export const NETWORKS: NetworkT[] = [
  { name: "Ethereum", icon: EthereumLogo, chainId: 4 },
  { name: "Avalanche", icon: AvalancheLogo, chainId: 43114 },
  { name: "Polygon", icon: PolygonLogo, chainId: 137 },
  { name: "BSC", icon: BinanceLogo, chainId: 56 },
];

export const DEFAULT_NET = {
  name: "Ethereum",
  icon: EthereumLogo,
  chainId: 4,
};

export const getLogoByChainId = (id: number): string => {
  const NETWORK_LOGOS: { [id: number]: string } = {
    4: EthereumLogo,
    56: BinanceLogo,
    137: PolygonLogo,
    43114: AvalancheLogo,
  };
  return NETWORK_LOGOS[id] || EthereumLogo;
};

export const API_URL = process.env.REACT_APP_API_LOCAL
  ? "http://localhost:5000"
  : "http://nftoolkit.eu-west-2.elasticbeanstalk.com/server";

export const ML_URL = process.env.REACT_APP_API_LOCAL
  ? "http://localhost:4000"
  : "http://nftoolkit.eu-west-2.elasticbeanstalk.com/ml";

export const accessibilityProps = (
  index: number,
  vertical = false
): { id: string; "aria-controls": string } => ({
  id: `${vertical ? "vertical-" : ""}tab-${index}`,
  "aria-controls": `${vertical ? "vertical-" : ""}tabpanel-${index}`,
});

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

export const siderbarMenuItems = [
  { text: "Create New Collection", location: "/create-new-collection" },
];

export const tetherAddress = "0xD92E713d051C37EbB2561803a3b5FBAbc4962431";

export const toTether = 6;
