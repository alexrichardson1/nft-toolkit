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
  return library;
}

const extendedFabStyle = {
  display: "flex",
  gap: "7px",
  alignItems: "center",
  justifyContent: "center",
};

const connector = new InjectedConnector({
  supportedChainIds: supportedChains,
});

const Wallet = (): JSX.Element => {
  const {
    active: networkActive,
    error: networkError,
    activate,
    account,
    chainId,
  } = useWeb3React();
  const { setSelectedNet } = useContext(NetworkContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const connectWallet = () => {
    activate(connector, (err) => {
      showSnackbar("error", err.message);
    });
  };

  useEffect(() => {
    connector
      .isAuthorized()
      .then((isAuthorised) => {
        if (isAuthorised && !networkActive && !networkError) {
          activate(connector, (err) => showSnackbar("error", err.message));
        }
      })
      .catch((err) => showSnackbar("error", err.message));

    const sessionChainId = sessionStorage.getItem("chainId");

    if (!chainId || sessionChainId === chainId.toString()) {
      return;
    }

    updateNetwork(chainId, setSelectedNet, showSnackbar);
    sessionStorage.setItem("chainId", chainId.toString());
  }, [chainId, networkActive]);

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
