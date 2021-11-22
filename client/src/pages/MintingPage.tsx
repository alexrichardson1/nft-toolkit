import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Paper,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { ProgressActions } from "actions/progressActions";
import SvgLogo from "components/common/SvgLogo";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import useAppDispatch from "hooks/useAppDispatch";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { getDollarValue } from "utils/coinGecko";
import { getLogoByChainId } from "utils/constants";
import {
  CollectionI,
  getCollection,
  getRPCProvider,
} from "utils/mintingPageUtils";

const DUMMY_DATA = {
  name: "COLLECTION_NAME",
  symbol: "COL",
  description: "THIS IS THE DESCRIPTION",
  address: "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
  tokens: [],
  gifSrc: "https://c.tenor.com/S4njt-KCLDgAAAAC/ole-gunnar-yes.gif",
  chainId: 1,
  price: "1",
  mintedAmount: BigNumber.from("1"),
  limit: BigNumber.from("3"),
};

const MAX_AMOUNT_ALLOWED = 20;
const MIN_AMOUNT_ALLOWED = 1;

const mintingBoxStyle = {
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
};

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

const mintingCardStyle: SxProps = {
  width: 350,
  height: 425,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};

interface ParamsI {
  collectionName: string;
  fromAddress: string;
}

const mintingCardImgStyle = (mintingData: CollectionI): SxProps => {
  return {
    top: { xs: "5%", lg: "-10%" },
    left: "50%",
    transform: "translateX(-50%)",
    position: "absolute",
    width: 200,
    height: 200,
    background: `url(${mintingData.gifSrc})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: 200,
  };
};

const mintingQuantityStyle = {
  "&.Mui-disabled": {
    color: "white",
    bgcolor: "secondary.main",
  },
};
const MintingPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { active, library, chainId } = useWeb3React();
  const { showSnackbar } = useContext(SnackbarContext);
  const { collectionName, fromAddress } = useParams<ParamsI>();
  const [error, setError] = useState(false);
  const [mintingData, setMintingData] = useState<CollectionI>(DUMMY_DATA);
  const [mintingQuantity, setMintingQuantity] = useState(MIN_AMOUNT_ALLOWED);
  const [isMinting, setIsMinting] = useState(false);
  const [usdValue, setUsdValue] = useState("$0.00");

  const handleQuantityIncrease = () =>
    setMintingQuantity((prev) => Math.min(prev + 1, MAX_AMOUNT_ALLOWED));
  const handleQuantityDecrease = () =>
    setMintingQuantity((prev) => Math.max(prev - 1, MIN_AMOUNT_ALLOWED));

  const handleMint = async () => {
    if (!active) {
      showSnackbar("warning", "Please connect your wallet first!");
      return;
    }
    if (chainId !== mintingData.chainId) {
      showSnackbar("warning", "Please connect to correct chain!");
      return;
    }
    const NFTContract = NftFactory.connect(
      mintingData.address,
      library.getSigner()
    );

    try {
      setIsMinting(true);
      const txResp = await NFTContract.mint(mintingQuantity, {
        value: BigNumber.from(mintingData.price).mul(
          BigNumber.from(mintingQuantity)
        ),
      });
      await txResp.wait();
      setIsMinting(false);
      showSnackbar("success", "NFTs minted!");
    } catch (err) {
      setIsMinting(false);
      showSnackbar("error", "Unable to mint NFT");
    }
  };

  const getTokenTracking = () => {
    return `${mintingData.mintedAmount.toString()}/${mintingData.limit.toString()} MINTED`;
  };

  const getMaxTokensLeft = () => {
    return mintingData.limit.sub(mintingData.mintedAmount).toNumber();
  };

  useEffect(() => {
    async function getCollectionData() {
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });
      const WAIT_TIME = 1000;
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      dispatch({
        type: ProgressActions.ADVANCE_PROGRESS_BY,
        payload: { advanceProgressBy: 50 },
      });
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });

      try {
        const collection = await getCollection(fromAddress, collectionName);
        const NFTContract = NftFactory.connect(
          collection.address,
          getRPCProvider(collection.chainId)
        );
        collection.limit = await NFTContract.collectionLimit();
        collection.mintedAmount = await NFTContract.tokenIdTracker();
        collection.tokens.forEach((token) => {
          collection.gifSrc = token.image;
        });
        setMintingData(collection);
        setUsdValue(await getDollarValue(collection.price, collection.chainId));
      } catch (error) {
        // TODO: handle invalid collection
        setError(true);
      }
    }
    getCollectionData();
  }, [collectionName, dispatch, fromAddress]);

  if (error) {
    // TODO: handle invalid collection
    return <Redirect to="/" />;
  }

  return (
    <Box sx={mintingBoxStyle}>
      <Collapse sx={{ width: 1 }} in={mintingData !== DUMMY_DATA}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          gap="10px">
          <Box display="flex" flexDirection="column" gap="10px" flexGrow={1}>
            <Box display="flex" flexDirection="column">
              <Typography
                textAlign={{ xs: "center", lg: "left" }}
                sx={textStyle}
                variant="h3"
                color="secondary">
                {collectionName.replaceAll("-", " ")}
              </Typography>
              <Typography
                textAlign={{ xs: "center", lg: "left" }}
                color="primary"
                sx={textStyle}>
                {mintingData.symbol}
              </Typography>
            </Box>
            <Typography textAlign={{ xs: "center", lg: "left" }}>
              {mintingData.description}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center">
            <Paper sx={mintingCardStyle} elevation={6}>
              <Paper sx={mintingCardImgStyle(mintingData)} />
              <Box
                display="flex"
                flexDirection="column"
                gap="10px"
                padding={3}
                alignItems="center">
                <Typography
                  sx={textStyle}
                  textAlign="center"
                  variant="h6"
                  color="primary">
                  {getTokenTracking()}
                </Typography>
                <ButtonGroup fullWidth>
                  <Button
                    id="decrease-quantity"
                    disabled={mintingQuantity <= MIN_AMOUNT_ALLOWED}
                    onClick={handleQuantityDecrease}
                    variant="contained">
                    -
                  </Button>
                  <Button
                    sx={mintingQuantityStyle}
                    variant="contained"
                    disabled>
                    {mintingQuantity}
                  </Button>
                  <Button
                    id="increase-quantity"
                    disabled={mintingQuantity >= getMaxTokensLeft()}
                    onClick={handleQuantityIncrease}
                    variant="contained">
                    +
                  </Button>
                </ButtonGroup>
                <LoadingButton
                  fullWidth
                  id="mint-button"
                  variant="contained"
                  onClick={handleMint}
                  loading={isMinting}
                  disabled={getMaxTokensLeft() === 0}>
                  {`Mint for ${formatEther(BigNumber.from(mintingData.price))}`}
                  <SvgLogo
                    icon={getLogoByChainId(mintingData.chainId)}
                    width="20px"
                    height="20px"
                    margins
                  />{" "}
                  {usdValue}
                </LoadingButton>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default MintingPage;
