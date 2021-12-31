import LoadingButton from "@mui/lab/LoadingButton";
import { Divider, Paper, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import SvgIcon from "components/common/SvgLogo";
import { utils } from "ethers";
import { Link } from "react-router-dom";
import { getLogoByChainId } from "utils/constants";
import "./card.css";
// import {  NFT__factory as NftFactory
// } from "typechain";

interface PropsT {
  info: CollDataI;
}

const MyCollectionCard = ({ info }: PropsT): JSX.Element => {
  // const [isLoading, setIsLoading] = useState(false);
  // const { account, library } = useWeb3React();
  // const handleWithdraw = async () => {
  // const nftContract = NFTFactory.connect(
  //   info.address,
  //   library.getSigner()
  // );
  // setIsLoading(true);
  //   try {
  //     const tx = await nftContract.buy(tokenId, {
  //       value: BigNumber.from(token.price),
  //     });
  //     await tx.wait();
  //     showSnackbar("success", "Purchase successful");
  //   } catch (e) {
  //     console.error(e);
  //     showSnackbar("error", "An error occurred. Please try again!");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <Paper
      component={Link}
      className="mycoll-card"
      sx={{ borderRadius: "10px" }}
      to={`/${info.chainId}/${info.address}`}>
      <img className="mycoll-card-img" src={info.image} alt="card-img" />
      <Stack padding="10px">
        <Divider />
        <Typography noWrap variant="h6" color="primary">
          {info.name}
        </Typography>
        <Typography gutterBottom noWrap color="secondary">
          {info.symbol}
        </Typography>
        <Stack gap="10px" alignItems="center" direction="row">
          <Typography gutterBottom noWrap>
            Balance: {utils.formatEther(info.balance)}
          </Typography>
          <SvgIcon
            width="20px"
            height="20px"
            icon={getLogoByChainId(info.chainId)}
            alt="network-logo"
          />
        </Stack>
        <LoadingButton variant="contained" fullWidth>
          Withdraw
        </LoadingButton>
      </Stack>
    </Paper>
  );
};

export default MyCollectionCard;
