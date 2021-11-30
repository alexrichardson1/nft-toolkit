import { Collapse, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { ProgressActions } from "actions/progressActions";
import useAppDispatch from "hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayCard from "./DisplayCard";

const dummyData: CollectionI[] = [
  {
    name: "Dummy",
    description: "DummyDescription",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: {},
    id: 0,
    price: "69",
  },
];

const dummyData2: CollectionI[] = [
  {
    id: 0,
    name: "APE 0",
    description: "",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
  {
    id: 1,
    name: "APE 1",
    description:
      "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
  {
    id: 2,
    name: "APE 2",
    description:
      "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
  {
    id: 3,
    name: "APE 3",
    description:
      "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
  {
    id: 4,
    name: "APE 4",
    description:
      "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
  {
    id: 5,
    name: "APE 5",
    description:
      "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
    image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
    attributes: { tier: "Legendary" },
    price: "69",
  },
];

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

const Market = (): JSX.Element => {
  const [collections, setCollections] = useState<CollectionI[]>(dummyData);
  const [collectionName, setCollectionName] = useState("");
  const { paramChainId } = useParams<ParamsI>();
  const dispatch = useAppDispatch();

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
      setCollectionName("Aayush Babies");
      setCollections(dummyData2);
    }
    getCollectionData();
  }, []);

  return (
    <Box alignItems="center" flexGrow={1} display="flex">
      <Collapse sx={{ width: 1 }} in={collections !== dummyData}>
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
              Aayu
            </Typography>
          </Box>
          <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
            {collections.map((dummy) => (
              <DisplayCard
                chainId={Number(paramChainId)}
                to="/"
                key={dummy.id}
                data={dummy}
              />
            ))}
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Market;
