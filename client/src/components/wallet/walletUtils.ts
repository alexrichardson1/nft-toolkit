import { Web3Provider } from "@ethersproject/providers";
import { AlertColor } from "@mui/material";
import { NETWORKS } from "utils/constants";
import {
  HEXADECIMAL,
  NOT_ADDED_NETWORK_ERROR,
  RPC_URLS,
} from "./networkConstants";

export const getAccountString = (account?: string | null): string => {
  if (!account) {
    return "Connect Wallet";
  }
  const START_CHARS = 8;
  const END_CHARS = 4;
  return `${account.slice(0, START_CHARS)}....${account.slice(-END_CHARS)}`;
};

export const updateNetwork = (
  chainId: number,
  setSelectedNet: (newNetwork: NetworkT) => void,
  showSnackbar: (type: AlertColor, message: string) => void
): void => {
  const selectedNet = NETWORKS.find((net) => net.chainId === chainId);
  if (selectedNet) {
    setSelectedNet(selectedNet);
    showSnackbar("success", `Connected to ${RPC_URLS[chainId]?.chainName}`);
  }
};

export const switchChain = (
  network: NetworkT,
  library: Web3Provider | undefined,
  setNetwork: (network: NetworkT) => void,
  showSnackbar: (type: AlertColor, message: string) => void
): void => {
  const { chainId } = network;
  // Able to change network freely if wallet not connected
  if (!library) {
    setNetwork(network);
    return;
  }
  // TODO: Solana and Cardano
  if (!chainId) {
    return;
  }
  const hexChainId = `0x${chainId.toString(HEXADECIMAL)}`;

  library
    .send("wallet_switchEthereumChain", [{ chainId: hexChainId }])
    .then(() =>
      showSnackbar("success", `Connected to ${RPC_URLS[chainId]?.chainName}`)
    )
    .catch((err) => {
      if (err.code === NOT_ADDED_NETWORK_ERROR) {
        // Adds network to metamask
        const rpcInfo = RPC_URLS[chainId];
        library.send("wallet_addEthereumChain", [rpcInfo]).catch((err) => {
          showSnackbar("error", err.message);
        });
      } else {
        showSnackbar("error", err.message);
      }
    });
};
