export const HEXADECIMAL = 16;
export const NOT_ADDED_NETWORK_ERROR = 4902;
export const CURRENCY_DECIMALS = 18;

const ETH_ID = 4;
const MATIC_ID = 137;
const AVAX_ID = 43114;
const BSC_ID = 56;

export const supportedChains = [ETH_ID, MATIC_ID, AVAX_ID, BSC_ID];

interface rpcInfoT {
  [key: number]: {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
}

export const RPC_URLS: rpcInfoT = {
  4: {
    chainId: "0x4",
    chainName: "Rinkeby Testnet",
    rpcUrls: ["https://rinkeby-light.eth.linkpool.io/"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: CURRENCY_DECIMALS,
    },
  },
  56: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com/"],
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: CURRENCY_DECIMALS,
    },
  },
  137: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: CURRENCY_DECIMALS,
    },
  },
  43114: {
    chainId: "0xA86A",
    chainName: "Avalanche C-Chain",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: CURRENCY_DECIMALS,
    },
  },
};
