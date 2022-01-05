import { Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import { getItemsPerPage } from "components/common/PageNumbers";
import DisplayCard from "components/marketplace/DisplayCard";
import { TokenI } from "components/marketplace/Market";
import { BigNumber } from "ethers";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { API_URL } from "utils/constants";
import { getRPCProvider } from "utils/mintingPageUtils";
import { undefinedCheck } from "utils/typeUtils";
import TemplatePage from "./TemplatePage";

interface ParamsI {
  address: string;
}

type NFTType = TokenI & {
  chainId: number;
  url?: string;
};

const dummyData: NFTType[] = [
  {
    name: "Dummy",
    description: "DummyDescription",
    image: "",
    attributes: {},
    id: 0,
    isStable: false,
    price: BigNumber.from(0),
    chainId: 4,
  },
];

const MyNFTsPage = (): JSX.Element => {
  const { address } = useParams<ParamsI>();
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();
  const [myNFTs, setMyNFTs] = useState<NFTType[]>(dummyData);

  const MAX_PROGRESS = 100;
  const LAST_INDEX = -1;

  useEffect(() => {
    const getCollectionData = async () => {
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });

      try {
        const res = await axios.get(`${API_URL}/collection/`);
        const { collections }: { collections: CollAddrI[] } = res.data;
        await Promise.all(
          collections.map(async (col) => {
            const provider = getRPCProvider(col.chainId);
            const nftContract = NftFactory.connect(col.address, provider);

            const getTransferFilter = nftContract.filters.Transfer;
            const filter = getTransferFilter(null, address);
            const allTransfers = await nftContract.queryFilter(filter);
            const tokenIds = allTransfers.map((value) => value.args.tokenId);

            tokenIds.filter(async (id) => {
              const filter = getTransferFilter(null, null, id);
              const transfers = await nftContract.queryFilter(filter);
              return transfers[LAST_INDEX]?.args.to === address;
            });

            const json = await axios.get(
              `${API_URL}/metadata/${col.chainId}/${col.address}`
            );
            const { tokens }: { tokens: ContractTokenI[] } = json.data;
            const tokenMetadatas = tokenIds.map((id) => {
              const token = undefinedCheck(
                tokens[id.toNumber()],
                "Token not found"
              );
              const attributeMap: AttributeI = {};
              token.attributes.forEach((attr: ContractAttributeI) => {
                attributeMap[attr.trait_type] = attr.value;
              });
              const { chainId, marketAddress, address } = col;
              return {
                ...token,
                id: id.toNumber(),
                attributes: attributeMap,
                price: BigNumber.from(0),
                isStable: false,
                chainId,
                url: marketAddress
                  ? `/${chainId}/${address}/${marketAddress}/${id.toNumber()}`
                  : void 0,
              };
            });
            setMyNFTs((prev) => {
              if (prev === dummyData) {
                return tokenMetadatas;
              }
              return [...prev, ...tokenMetadatas];
            });
            dispatch({
              type: ProgressActions.ADVANCE_PROGRESS_BY,
              payload: { advanceProgressBy: MAX_PROGRESS / collections.length },
            });
          })
        );
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
        dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
      }
    };
    getCollectionData();
  }, [address]);

  useEffect(() => {
    setMyNFTs(dummyData);
  }, [address]);

  interface PropsT {
    page: number;
    data: NFTType[];
  }

  const GenerateTokens = ({ page, data }: PropsT): JSX.Element => {
    if (myNFTs.length === 0) {
      return (
        <Typography variant="h4" color="primary">
          Nothing to see here yet, please mint some tokens!
        </Typography>
      );
    }
    if (!account) {
      return (
        <Typography variant="h4" color="primary">
          Please connect to your wallet to see your NFTs!
        </Typography>
      );
    }
    return (
      <>
        {getItemsPerPage(page, data).map((token) => (
          <DisplayCard
            chainId={token.chainId}
            to={token.url}
            key={token.url}
            data={token}
          />
        ))}
      </>
    );
  };

  return (
    <TemplatePage
      title={"Owned NFTs"}
      address={address}
      data={myNFTs}
      dummyData={dummyData}
      Component={GenerateTokens}
    />
  );
};

export default MyNFTsPage;
