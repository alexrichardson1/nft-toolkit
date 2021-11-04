import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Fab, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import NetworkContext from "context/network/NetworkContext";
import { useContext, useEffect } from "react";
import {
  getAccountString,
  supportedChains,
  updateNetwork,
} from "./walletUtils";

export function getLibrary(
  provider: ExternalProvider | JsonRpcFetchFunc
): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const extendedFabStyle = {
  display: "flex",
  gap: "7px",
  alignItems: "center",
  justifyCotnent: "center",
};

const HEXADECIMAL = 16;

export const switchChain = (
  network: NetworkT,
  library: Web3Provider,
  setNetwork: (network: NetworkT) => void
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
  library
    .send("wallet_switchEthereumChain", [
      { chainId: `0x${chainId.toString(HEXADECIMAL)}` },
    ])
    .catch((err) => {
      // TODO: Add network if not in metamask
      // TODO: Error snackbar
      console.log(err);
    });
};

const Wallet = (): JSX.Element => {
  const { activate, account, chainId } = useWeb3React();
  const { setSelectedNet } = useContext(NetworkContext);
  const connector = new InjectedConnector({
    supportedChainIds: supportedChains,
  });
  const connectWallet = () => {
    activate(connector);
    // TODO: Show snackbar error
    // const { showSnackbar } = useContext(SnackbarContext);
    // console.log(err);
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }

    updateNetwork(chainId, setSelectedNet);
  }, [chainId]);

  return (
    <Fab
      onClick={connectWallet}
      id="connect-wallet-btn"
      variant="extended"
      color="primary"
      aria-label="connect wallet"
      sx={extendedFabStyle}>
      <AccountBalanceWalletIcon />
      <Typography>{getAccountString(account)}</Typography>
    </Fab>
  );
};

export default Wallet;
