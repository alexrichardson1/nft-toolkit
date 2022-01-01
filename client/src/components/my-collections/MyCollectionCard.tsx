import LoadingButton from "@mui/lab/LoadingButton";
import { Divider, Paper, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import SvgIcon from "components/common/SvgLogo";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { utils } from "ethers";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { getLogoByChainId } from "utils/constants";
import "./myCollCard.css";

interface PropsT {
  info: CollDataI;
}

const MyCollectionCard = ({ info }: PropsT): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(info.balance);
  const { showSnackbar } = useContext(SnackbarContext);
  const { account, library } = useWeb3React();

  const handleWithdraw = async () => {
    const nftContract = NftFactory.connect(info.address, library.getSigner());
    setIsLoading(true);
    try {
      const tx = await nftContract.withdraw();
      await tx.wait();
      showSnackbar("success", "Withdrawal successful");
      setBalance("0");
    } catch (e) {
      console.error(e);
      showSnackbar("error", "An error occurred. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper className="mycoll-card" sx={{ borderRadius: "10px" }}>
      <Link to={`/${info.chainId}/${info.address}`}>
        <img className="mycoll-card-img" src={info.image} alt="card-img" />
      </Link>
      <Stack padding="10px">
        <Divider />
        <Typography noWrap variant="h6" color="primary">
          {info.name}
        </Typography>
        <Typography gutterBottom noWrap color="secondary">
          {info.symbol}
        </Typography>
        {account === info.owner && (
          <>
            <Stack gap="10px" alignItems="center" direction="row">
              <Typography gutterBottom noWrap>
                Balance: {utils.formatEther(balance)}
              </Typography>
              <SvgIcon
                width="20px"
                height="20px"
                icon={getLogoByChainId(info.chainId)}
                alt="network-logo"
              />
            </Stack>
            <LoadingButton
              variant="contained"
              fullWidth
              loading={isLoading}
              onClick={handleWithdraw}>
              Withdraw
            </LoadingButton>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default MyCollectionCard;
