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
import SnackbarContext from "context/snackbar/SnackbarContext";
import { useContext, useEffect } from "react";
import { supportedChains } from "./networkConstants";
import { getAccountString, updateNetwork } from "./walletUtils";

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
  justifyContent: "center",
};

const Wallet = (): JSX.Element => {
  const { activate, account, chainId } = useWeb3React();
  const { setSelectedNet } = useContext(NetworkContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const connector = new InjectedConnector({
    supportedChainIds: supportedChains,
  });

  const connectWallet = () => {
    activate(connector, (err) => {
      showSnackbar("error", err.message);
    });
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }

    updateNetwork(chainId, setSelectedNet, showSnackbar);
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
