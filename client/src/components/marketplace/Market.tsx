import { Collapse, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import { BigNumber } from "ethers";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Market__factory as MarketFactory,
  NFT__factory as NftFactory,
} from "typechain";
import { API_URL } from "utils/constants";
import { getRPCProvider } from "utils/mintingPageUtils";
import DisplayCard from "./DisplayCard";

export interface TokenI {
  id: number;
  name: string;
  description: string;
  image: string;
  price: BigNumber;
  isOwner?: boolean;
  attributes: AttributeI;
}

const dummyData: TokenI[] = [
  {
    name: "Dummy",
    description: "DummyDescription",
    image: "",
    attributes: {},
    id: 0,
    price: BigNumber.from(0),
  },
];

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

const Market = (): JSX.Element => {
  const [tokens, setCollections] = useState<TokenI[]>(dummyData);
  const [collectionName, setCollectionName] = useState("");
  const [symbol, setSymbol] = useState("");
  const { paramChainId, address, marketAddress } = useParams<
    ParamsI & { marketAddress: string }
  >();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getCollectionData() {
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });

      const nftContract = NftFactory.connect(
        address,
        getRPCProvider(parseInt(paramChainId))
      );
      const marketContract = MarketFactory.connect(
        marketAddress,
        getRPCProvider(parseInt(paramChainId))
      );
      const totalSupply = await nftContract.totalSupply();
      const name = await nftContract.name();
      const symbol = await nftContract.symbol();

      dispatch({
        type: ProgressActions.ADVANCE_PROGRESS_BY,
        payload: { advanceProgressBy: 50 },
      });
      const res = await axios.get(
        `${API_URL}/metadata/${paramChainId}/${address}`
      );
      let { tokens }: { tokens: ContractTokenI[] } = res.data;
      if (tokens.length < totalSupply.toNumber()) {
        tokens = tokens.slice(0, totalSupply.toNumber());
      }
      const transTokens = await Promise.all(
        tokens.map(async (token, index) => {
          const attributeMap: AttributeI = {};
          token.attributes.forEach((attr: ContractAttributeI) => {
            attributeMap[attr.trait_type] = attr.value;
          });
          const price = await marketContract.listings(index);
          return {
            ...token,
            id: index,
            attributes: attributeMap,
            price,
          };
        })
      );

      dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
      dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
      setCollectionName(name);
      setSymbol(symbol);
      setCollections(transTokens);
    }
    getCollectionData();
  }, []);

  return (
    <Box alignItems="center" flexGrow={1} display="flex">
      <Collapse sx={{ width: 1 }} in={tokens !== dummyData}>
        <Stack spacing={2} justifyContent="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              textAlign="center"
              sx={textStyle}
              variant="h3"
              color="secondary">
              {collectionName}
            </Typography>
            <Typography textAlign="center" sx={textStyle} color="primary">
              {symbol}
            </Typography>
          </Box>
          <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
            {tokens.map((token) => (
              <DisplayCard
                chainId={Number(paramChainId)}
                to={`/${paramChainId}/${address}/${marketAddress}/${token.id}`}
                key={token.id}
                data={token}
              />
            ))}
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Market;
