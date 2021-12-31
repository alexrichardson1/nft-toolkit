import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { ProgressActions } from "actions/progressActions";
import SvgIcon from "components/common/SvgLogo";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import useAppDispatch from "hooks/useAppDispatch";
import { useContext, useEffect, useMemo, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { getDollarValue } from "utils/coinGecko";
import { getLogoByChainId } from "utils/constants";
import { CollectionI, getCollection } from "utils/mintingPageUtils";

const DUMMY_DATA = {
  name: "DummyCollectionName",
  symbol: "DUMMY",
  description: "DummyDescription",
  address: "DummyAddress",
  tokens: [],
  gifSrc: "DummyGIFAddress",
  chainId: 1,
  price: BigNumber.from("1"),
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

const mintingCardImgStyle = (mintingData: CollectionI): SxProps => {
  return {
    top: { xs: "5%", lg: "-10%" },
    left: "50%",
    transform: "translateX(-50%)",
    position: "absolute",
    width: 250,
    height: 250,
    background: `url(${mintingData.gifSrc})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "250px 250px",
  };
};

const mintingQuantityStyle = {
  "&.Mui-disabled": {
    color: "white",
    bgcolor: "secondary.main",
  },
};
const DECIMALS = 2;

const MintingPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { active, library, chainId } = useWeb3React();
  const { showSnackbar } = useContext(SnackbarContext);
  const { paramChainId, address } = useParams<ParamsI>();
  const [error, setError] = useState(false);
  const [mintingData, setMintingData] = useState<CollectionI>(DUMMY_DATA);
  const [mintingQuantity, setMintingQuantity] = useState(MIN_AMOUNT_ALLOWED);
  const [isMinting, setIsMinting] = useState(false);
  const [usdValue, setUsdValue] = useState(0.0);
  const logo = useMemo(() => getLogoByChainId(mintingData.chainId), []);

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
      if (isMinting) {
        return;
      }
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });
      const WAIT_TIME = 1000;

      dispatch({
        type: ProgressActions.ADVANCE_PROGRESS_BY,
        payload: { advanceProgressBy: 50 },
      });
      try {
        const collection = await getCollection(paramChainId, address);
        dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
        await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
        dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
        setMintingQuantity(MIN_AMOUNT_ALLOWED);
        setMintingData(collection);
        setUsdValue(
          await getDollarValue(collection.price.toString(), collection.chainId)
        );
      } catch (error) {
        dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
        setError(true);
      }
    }
    getCollectionData();
  }, [paramChainId, address, isMinting]);

  if (error) {
    return <Redirect to="/404" />;
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
                {mintingData.name}
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
            {mintingData.marketAddress ? (
              <Link
                underline="none"
                href={`/${paramChainId}/${address}/${mintingData.marketAddress}`}>
                <Button variant="contained">Go to Market</Button>
              </Link>
            ) : (
              <></>
            )}
          </Box>

          <Box pt={10} pl={2} display="flex" justifyContent="center">
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
                  {`Mint for ${formatEther(
                    BigNumber.from(mintingData.price).mul(mintingQuantity)
                  )}`}
                  {!isMinting && (
                    <SvgIcon
                      alt="network-icon"
                      icon={logo}
                      width="20px"
                      height="20px"
                      margins
                    />
                  )}{" "}
                  ${`(${(mintingQuantity * usdValue).toFixed(DECIMALS)})`}
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
