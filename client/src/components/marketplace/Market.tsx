import ConstructionIcon from "@mui/icons-material/Construction";
import { LoadingButton } from "@mui/lab";
import { Button, Collapse, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import { getItemsPerPage, PageNumbers } from "components/common/PageNumbers";
import SvgLogo from "components/common/SvgLogo";
import SnackbarContext from "context/snackbar/SnackbarContext";
import { BigNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import useAppDispatch from "hooks/useAppDispatch";
import circleIcon from "images/circle.svg";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Market__factory as MarketFactory,
  NFT__factory as NftFactory,
} from "typechain";
import { API_URL, getLogoByChainId, toCircle } from "utils/constants";
import { getRPCProvider } from "utils/mintingPageUtils";
import DisplayCard from "./DisplayCard";

export interface TokenI {
  id: number;
  name: string;
  description: string;
  image: string;
  price: BigNumber;
  isStable: boolean;
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
    isStable: false,
    price: BigNumber.from(0),
  },
];

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

interface RoyaltiesI {
  native: BigNumber;
  stable: BigNumber;
}

const DEFAULT_ROYALTY: RoyaltiesI = {
  native: BigNumber.from(0),
  stable: BigNumber.from(0),
};

const Market = (): JSX.Element => {
  const [tokens, setCollections] = useState<TokenI[]>(dummyData);
  const [collectionName, setCollectionName] = useState("");
  const { account, library } = useWeb3React();
  const { showSnackbar } = useContext(SnackbarContext);
  const [royalties, setRoyalties] = useState(DEFAULT_ROYALTY);
  const [royaltyLoading, setRoyaltyLoading] = useState(false);
  const [page, setPage] = useState(1);
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
      const totalSupply = await nftContract.tokenIdTracker();
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
      if (tokens.length > totalSupply.toNumber()) {
        tokens = tokens.slice(0, totalSupply.toNumber());
      }
      const transTokens = await Promise.all(
        tokens.map(async (token, index) => {
          const attributeMap: AttributeI = {};
          token.attributes.forEach((attr: ContractAttributeI) => {
            attributeMap[attr.trait_type] = attr.value;
          });
          const price = await marketContract.listings(index);
          const isStable = await marketContract.areStable(index);
          return {
            ...token,
            id: index,
            attributes: attributeMap,
            price,
            isStable,
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
  }, [account]);

  useEffect(() => {
    const updateRoyalties = async () => {
      const marketContract = MarketFactory.connect(
        marketAddress,
        getRPCProvider(parseInt(paramChainId))
      );
      if (account) {
        setRoyalties(await marketContract.royalties(account));
      } else {
        setRoyalties(DEFAULT_ROYALTY);
      }
    };
    updateRoyalties();
  }, [account, royaltyLoading]);

  const handleClaimRoyalties = async () => {
    const marketContract = MarketFactory.connect(
      marketAddress,
      library.getSigner()
    );
    try {
      setRoyaltyLoading(true);
      const tx = await marketContract.claimRoyalties();
      await tx.wait();
      showSnackbar("success", "Royalty claim successful");
    } catch (error) {
      showSnackbar("error", "An error occurred. Please try again!");
    } finally {
      setRoyaltyLoading(false);
    }
  };

  return (
    <Box flexGrow={1} display="flex">
      <Collapse sx={{ width: 1 }} in={tokens !== dummyData}>
        <Stack spacing={2} justifyContent="center">
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-between">
              <Button
                startIcon={<ConstructionIcon />}
                variant="outlined"
                href={`/${paramChainId}/${address}`}>
                Minting Page
              </Button>
              {(royalties.stable.gt(0) || royalties.native.gt(0)) && (
                <Stack alignItems="center" gap={2} direction="row">
                  {royalties.stable.gt(0) && (
                    <Stack gap={1} direction="row">
                      {formatUnits(royalties.stable, toCircle)}
                      <SvgLogo
                        width="20px"
                        height="20px"
                        alt="stable-icon"
                        icon={circleIcon}
                      />
                    </Stack>
                  )}
                  {royalties.native.gt(0) && (
                    <Stack gap={1} direction="row">
                      {formatEther(royalties.native)}
                      <SvgLogo
                        width="20px"
                        height="20px"
                        alt="native-icon"
                        icon={getLogoByChainId(Number(paramChainId))}
                      />
                    </Stack>
                  )}
                  <LoadingButton
                    variant="contained"
                    onClick={handleClaimRoyalties}
                    loading={royaltyLoading}>
                    Claim Royalties
                  </LoadingButton>
                </Stack>
              )}
            </Box>
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
            {tokens.length === 0 ? (
              <Typography variant="h4" color="primary">
                Nothing to see here yet, please mint some tokens!
              </Typography>
            ) : (
              getItemsPerPage(page, tokens).map((token) => (
                <DisplayCard
                  chainId={Number(paramChainId)}
                  to={`/${paramChainId}/${address}/${marketAddress}/${token.id}`}
                  key={token.id}
                  data={token}
                />
              ))
            )}
          </Box>
          <PageNumbers
            page={page}
            setPage={setPage}
            arrayLength={tokens.length}
          />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Market;
