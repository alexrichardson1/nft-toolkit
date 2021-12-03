import { Collapse, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { getRPCProvider } from "utils/mintingPageUtils";
import DisplayCard from "./DisplayCard";

const dummyData: TokenI[] = [
  {
    name: "Dummy",
    description: "DummyDescription",
    image: "",
    attributes: {},
    id: 0,
    price: "69",
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
  const { paramChainId, address } = useParams<
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
      const totalSupply = await nftContract.totalSupply();
      const name = await nftContract.name();
      const symbol = await nftContract.symbol();
      const allTokens: TokenI[] = Array.from({
        length: totalSupply.toNumber(),
      });
      dispatch({
        type: ProgressActions.ADVANCE_PROGRESS_BY,
        payload: { advanceProgressBy: 50 },
      });
      const collectionData = await Promise.all(
        allTokens.map(async (_value, index) => {
          const tokenURI = await nftContract.tokenURI(index);
          const res = await axios.get(tokenURI);
          res.data.id = index;
          const attributeMap: AttributeI = {};
          res.data.attributes.forEach((attr: ContractAttributeI) => {
            attributeMap[attr.trait_type] = attr.value;
          });
          res.data.attributes = attributeMap;
          return res.data;
        })
      );

      dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
      dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
      setCollectionName(name);
      setSymbol(symbol);
      setCollections(collectionData);
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
                to={`/${paramChainId}/${address}/${token.id}`}
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
