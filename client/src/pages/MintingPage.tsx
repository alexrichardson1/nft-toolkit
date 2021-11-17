import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Paper,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { ProgressActions } from "actions/progressActions";
import SvgLogo from "components/common/SvgLogo";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { getLogoByChainId } from "utils/constants";
import { getCollection } from "utils/mintingPageUtils";

const DUMMY_DATA = {
  name: "COLLECTION_NAME",
  symbol: "COL",
  description: "THIS IS THE DESCRIPTION",
  mintedAmount: 5,
  limit: 10000,
  gifSrc: "https://c.tenor.com/S4njt-KCLDgAAAAC/ole-gunnar-yes.gif",
  chainId: 1,
  price: 1,
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

interface CollectionI {
  name: string;
  mintedAmount?: number;
  symbol: string;
  description: string;
  limit?: number;
  gifSrc?: string;
  chainId: number;
  price?: number;
}

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
  const { collectionName, fromAddress } = useParams<ParamsI>();
  const [error, setError] = useState(false);
  const [mintingData, setMintingData] = useState<CollectionI>(DUMMY_DATA);
  const [mintingQuantity, setMintingQuantity] = useState(MIN_AMOUNT_ALLOWED);

  const handleQuantityIncrease = () =>
    setMintingQuantity((prev) => Math.min(prev + 1, MAX_AMOUNT_ALLOWED));
  const handleQuantityDecrease = () =>
    setMintingQuantity((prev) => Math.max(prev - 1, MIN_AMOUNT_ALLOWED));

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
        setMintingData(collection);
      } catch (error) {
        // TODO: handle invalid collection
        setError(true);
      }
    }
    getCollectionData();
  }, []);

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
                  {mintingData.mintedAmount}/{mintingData.limit}{" "}
                  {collectionName.replaceAll("-", " ")} MINTED
                </Typography>
                <ButtonGroup fullWidth>
                  <Button
                    id="decrease-quantity"
                    disabled={mintingQuantity === MIN_AMOUNT_ALLOWED}
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
                    disabled={mintingQuantity === MAX_AMOUNT_ALLOWED}
                    onClick={handleQuantityIncrease}
                    variant="contained">
                    +
                  </Button>
                </ButtonGroup>
                <Button fullWidth variant="contained">
                  Mint now for {mintingData.price}
                  <SvgLogo
                    icon={getLogoByChainId(mintingData.chainId)}
                    width="20px"
                    height="20px"
                    margins
                  />
                  each!
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default MintingPage;
