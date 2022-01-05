/* eslint-disable max-lines-per-function */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LoadingButton } from "@mui/lab";
import { Collapse, Grid, Stack, Switch } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { useWeb3React } from "@web3-react/core";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import Input from "components/common/Input";
import SvgIcon from "components/common/SvgLogo";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import useAppDispatch from "hooks/useAppDispatch";
import tetherLogo from "images/tether.svg";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ERC20__factory as ERC20Factory,
  Market__factory as MarketFactory,
  NFT__factory as NftFactory,
} from "typechain";
import { getLogoByChainId, tetherAddress, toTether } from "utils/constants";
import { getRPCProvider } from "utils/mintingPageUtils";
import DisplayCard from "./DisplayCard";
import { TokenI } from "./Market";

const dummyData: TokenI = {
  name: "APE 1",
  description: "dummy_description",
  image: "",
  attributes: { tier: "Legendary" },
  id: 0,
  price: BigNumber.from(0),
  isStable: false,
  isOwner: true,
};

const paperStyle: SxProps = {
  bgcolor: "background.paper",
  boxShadow: 3,
  borderRadius: 2,
  padding: 3,
  margin: 4,
  width: "55%",
};

const PurchasePage = (): JSX.Element => {
  const { paramChainId, tokenId, address, marketAddress } = useParams<
    ParamsI & { tokenId: string; marketAddress: string }
  >();
  const { account, library } = useWeb3React();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<TokenI>(dummyData);
  const [symbol, setSymbol] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [listPrice, setListPrice] = useState("");
  const { showSnackbar } = useContext(SnackbarContext);
  const [stableCoinList, setStableCoinList] = useState(false);

  useEffect(() => {
    async function getTokenData() {
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });
      const nftContract = NftFactory.connect(
        address,
        getRPCProvider(parseInt(paramChainId))
      );
      const marketContract = MarketFactory.connect(
        marketAddress,
        getRPCProvider(parseInt(paramChainId))
      );
      dispatch({
        type: ProgressActions.ADVANCE_PROGRESS_BY,
        payload: { advanceProgressBy: 50 },
      });

      try {
        const tokenURI = await nftContract.tokenURI(tokenId);
        const res = await axios.get(tokenURI);
        res.data.id = parseInt(tokenId);
        const attributeMap: AttributeI = {};
        res.data.attributes.forEach((attr: ContractAttributeI) => {
          attributeMap[attr.trait_type] = attr.value;
        });
        res.data.attributes = attributeMap;
        res.data.price = await marketContract.listings(res.data.id);
        res.data.isStable = await marketContract.areStable(res.data.id);
        const curOwner = await nftContract.ownerOf(tokenId);
        res.data.isOwner = curOwner === account;
        const token = res.data;
        setToken(token);
        const symbol = await nftContract.symbol();
        setSymbol(symbol);
      } catch (e) {
        console.error(e);
      }
      dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
      dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
    }
    getTokenData();
  }, [loadingButton, account]);

  const handlePurchase = async () => {
    const marketContract = MarketFactory.connect(
      marketAddress,
      library.getSigner()
    );
    setLoadingButton(true);
    try {
      if (token.isStable) {
        const tetherContract = ERC20Factory.connect(
          tetherAddress,
          library.getSigner()
        );
        const approveTx = await tetherContract.approve(
          marketContract.address,
          token.price
        );
        await approveTx.wait();
        showSnackbar("success", "Tether approval successful");
      }
      const tx = await marketContract.buy(tokenId, {
        value: BigNumber.from(token.isStable ? 0 : token.price),
      });
      await tx.wait();
      showSnackbar("success", "Purchase successful");
    } catch (e) {
      console.error(e);
      showSnackbar("error", "An error occurred. Please try again!");
    } finally {
      setLoadingButton(false);
    }
  };

  const handleListing: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const marketContract = MarketFactory.connect(
      marketAddress,
      library.getSigner()
    );
    const nftContract = NftFactory.connect(address, library.getSigner());
    setLoadingButton(true);
    let price;
    if (stableCoinList) {
      price = parseUnits(listPrice, toTether);
    } else {
      price = parseUnits(listPrice);
    }
    try {
      const approveTx = await nftContract.approve(marketAddress, tokenId);
      await approveTx.wait();
      const tx = await marketContract.sellListing(
        tokenId,
        price,
        stableCoinList
      );
      await tx.wait();
      showSnackbar("success", "Listing successful");
    } catch (e) {
      console.error(e);
      showSnackbar("error", "An error occurred. Please try again!");
    } finally {
      setLoadingButton(false);
    }
  };

  const handleDelist = async () => {
    const marketContract = MarketFactory.connect(
      marketAddress,
      library.getSigner()
    );
    setLoadingButton(true);
    try {
      const tx = await marketContract.delist(tokenId);
      await tx.wait();
      showSnackbar("success", "Delisting successful");
    } catch (e) {
      showSnackbar("error", "An error occurred. Please try again!");
      console.error(e);
    } finally {
      setLoadingButton(false);
    }
  };

  const buttons = (token: TokenI) => {
    if (token.isOwner) {
      if (!token.price.eq(0)) {
        return (
          <LoadingButton
            loading={loadingButton}
            variant="contained"
            size="large"
            border-radius="10px"
            onClick={handleDelist}>
            Delist Token
          </LoadingButton>
        );
      }
      return (
        <Stack
          component="form"
          onSubmit={handleListing}
          direction="row"
          alignItems="center"
          spacing={2}>
          <Input
            required
            notFullWidth
            onChange={(e) => setListPrice(e.target.value || "0")}
            InputProps={{
              inputProps: { min: 0, step: "any" },
            }}
            label="Enter listing price"
            value={listPrice}
            type="number"
            placeholder="0"
          />
          <Stack alignItems="center" direction="row">
            <SvgIcon
              width="20px"
              height="20px"
              alt="coin"
              icon={getLogoByChainId(Number(paramChainId))}
            />
            <Switch
              checked={stableCoinList}
              onChange={() => setStableCoinList((prev) => !prev)}
              inputProps={{ "aria-label": "controlled" }}
            />
            <SvgIcon width="20px" height="20px" alt="coin" icon={tetherLogo} />
          </Stack>
          <LoadingButton
            type="submit"
            loading={loadingButton}
            variant="contained"
            size="large"
            border-radius="10px">
            List Token
          </LoadingButton>
        </Stack>
      );
    }
    if (!token.price.eq(0)) {
      return (
        <LoadingButton
          loading={loadingButton}
          variant="contained"
          size="large"
          border-radius="10px"
          onClick={handlePurchase}>
          Purchase
        </LoadingButton>
      );
    }

    return <></>;
  };

  return (
    <>
      <Collapse sx={{ width: 1 }} in={token !== dummyData}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          href={`/${paramChainId}/${address}/${marketAddress}`}
          sx={{ mb: 2 }}>
          Marketplace
        </Button>
        <Box alignItems="center" flexGrow={1} display="flex" gap={10}>
          <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
            <DisplayCard
              chainId={Number(paramChainId)}
              key={token.id}
              data={token}
            />
          </Box>
          <Box sx={paperStyle}>
            <Box
              display="flex"
              gap="10px"
              flexDirection="column"
              alignItems="center">
              <ListItem>
                <Box>
                  <Typography
                    textAlign="left"
                    variant="h3"
                    color="secondary"
                    fontWeight="medium">
                    {token.name}
                  </Typography>
                  <Typography
                    textAlign="left"
                    color="primary"
                    fontStyle="oblique">
                    {symbol}
                  </Typography>
                </Box>
              </ListItem>
              <Divider variant="middle" flexItem={true} />
              <ListItem>
                <Grid container spacing={2}>
                  {Object.entries(token.attributes).map((attr, index) => {
                    const [key, value] = attr;
                    return (
                      <Grid item xs={12} sm={6} md={3.5} key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="info"
                          border-radius="5px">
                          <ListItemText primary={key} secondary={value} />
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </ListItem>
              <Box>{buttons(token)}</Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </>
  );
};

export default PurchasePage;
