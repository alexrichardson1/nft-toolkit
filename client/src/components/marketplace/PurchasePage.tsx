import { Collapse, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Market__factory as MarketFactory,
  NFT__factory as NftFactory,
} from "typechain";
import { getRPCProvider } from "utils/mintingPageUtils";
import DisplayCard from "./DisplayCard";

const dummyData: TokenI = {
  name: "APE 1",
  description:
    "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
  image: "",
  attributes: { tier: "Legendary" },
  id: 0,
  price: "69",
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
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<TokenI>(dummyData);
  const [symbol, setSymbol] = useState("");

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

      const tokenURI = await nftContract.tokenURI(tokenId);
      const res = await axios.get(tokenURI);
      res.data.id = parseInt(tokenId);
      const attributeMap: AttributeI = {};
      res.data.attributes.forEach((attr: ContractAttributeI) => {
        attributeMap[attr.trait_type] = attr.value;
      });
      res.data.attributes = attributeMap;
      res.data.price = await (
        await marketContract.listings(res.data.id)
      ).toString();
      const token = res.data;
      setToken(token);

      const symbol = await nftContract.symbol();
      setSymbol(symbol);

      dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
      dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
    }
    getTokenData();
  }, []);

  return (
    <Collapse sx={{ width: 1 }} in={token !== dummyData}>
      <Box alignItems="center" flexGrow={1} display="flex" gap={10}>
        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <DisplayCard
            chainId={Number(paramChainId)}
            to={`/${paramChainId}/${address}/${marketAddress}/${tokenId}`}
            key={token.id}
            data={token}
          />
        </Box>
        <Box sx={paperStyle}>
          <Box display="flex" flexDirection="column" alignItems="center">
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
            <Divider variant="middle" />
            <ListItem>
              <Grid container>
                {Object.entries(token.attributes).map((attr, index) => {
                  const [key, value] = attr;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ListItem key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="info"
                          border-radius="5px">
                          <ListItemText primary={key} secondary={value} />
                        </Button>
                      </ListItem>
                    </Grid>
                  );
                })}
              </Grid>
            </ListItem>
            <Divider variant="middle" />
            {/* <ListItem>
              <Box>
                <Typography textAlign="left" color="secondary">
                  Floor Price: xx ETH
                </Typography>
              </Box>
            </ListItem> */}
            <Box>
              <Button variant="contained" size="large" border-radius="10px">
                Purchase
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
};

export default PurchasePage;
