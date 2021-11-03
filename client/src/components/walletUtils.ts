import { NETWORKS } from "utils/constants";

export const getAccountString = (account?: string | null): string => {
  if (!account) {
    return "Connect Wallet";
  }
  const START_CHARS = 8;
  const END_CHARS = 4;
  return `${account.slice(0, START_CHARS)}....${account.slice(-END_CHARS)}`;
};

// TODO: Testnet chain ids
const ETH_ID = 1;
const MATIC_ID = 137;
const AVAX_ID = 43114;
const BSC_ID = 56;

export const supportedChains = [ETH_ID, MATIC_ID, AVAX_ID, BSC_ID];

export const updateNetwork = (
  chainId: number,
  setSelectedNet: (newNetwork: NetworkT) => void
): void => {
  const selectedNet = NETWORKS.find((net) => net.chainId === chainId);
  if (selectedNet) {
    setSelectedNet(selectedNet);
  }
};
