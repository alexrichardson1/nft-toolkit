import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system";
import { ProgressActions } from "actions/progressActions";
import axios from "axios";
import MyCollectionCard from "components/my-collections/MyCollectionCard";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NFT__factory as NftFactory } from "typechain";
import { API_URL } from "utils/constants";
import { getRPCProvider } from "utils/mintingPageUtils";

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

interface ParamsI {
  address: string;
}

const MyCollectionsPage = (): JSX.Element => {
  const { address } = useParams<ParamsI>();
  const dispatch = useAppDispatch();
  const [myCollections, setMyCollections] = useState<CollDataI[]>([]);

  useEffect(() => {
    async function getCollectionData() {
      dispatch({ type: ProgressActions.START_PROGRESS, payload: {} });

      try {
        const res = await axios.get(`${API_URL}/collection/${address}`);
        const { collections }: { collections: CollAddrI[] } = res.data;

        const fetchCollections = await Promise.all(
          collections.map(async (col) => {
            const provider = getRPCProvider(col.chainId);
            const nftContract = NftFactory.connect(col.address, provider);

            return {
              name: await nftContract.name(),
              symbol: await nftContract.symbol(),
              chainId: col.chainId,
              address: col.address,
              image: col.image ?? "",
              balance: (await provider.getBalance(col.address)).toString(),
              owner: await nftContract.owner(),
            };
          })
        );

        setMyCollections(fetchCollections);

        dispatch({
          type: ProgressActions.ADVANCE_PROGRESS_BY,
          payload: { advanceProgressBy: 50 },
        });
      } catch (e) {
        console.error(e);
      } finally {
        dispatch({ type: ProgressActions.FINISH_PROGRESS, payload: {} });
        dispatch({ type: ProgressActions.STOP_PROGRESS, payload: {} });
      }
    }
    getCollectionData();
  }, [address]);

  return (
    <Stack height="100%" spacing={2} overflow="auto">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          textAlign="center"
          sx={textStyle}
          variant="h3"
          color="secondary">
          Created Collections
        </Typography>
        <Typography textAlign="center" sx={textStyle} color="primary">
          {address}
        </Typography>
      </Box>
      <Box
        padding="10px"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={3}>
        {myCollections.map((col, index) => (
          <MyCollectionCard key={index} info={col} />
        ))}
      </Box>
    </Stack>
  );
};

export default MyCollectionsPage;
