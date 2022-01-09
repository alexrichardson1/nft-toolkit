import FireIcon from "@mui/icons-material/LocalFireDepartment";
import {
  List,
  ListItem,
  ListItemText,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { SxProps } from "@mui/system";
import Box from "@mui/system/Box";
import InfoTooltip from "components/common/InfoToolTip";
import PageHeader from "components/common/PageHeader";
import NoImageFallback from "images/no-image.jpg";
import { ReactNode } from "react";
import Carousel from "react-material-ui-carousel";
import getComponentByMode from "utils/getComponentByMode";
import { wrongStepGenerative, wrongStepStatic } from "utils/pages";

const REC_STEP_NUMBER_STATIC = 3;
const REC_STEP_NUMBER_GEN = 5;
const BAD_HYPE_UPPER_BOUND = 30;
const GOOD_HYPE_UPPER_BOUND = 60;
const HYPE_TT_TEXT =
  "This indicates how hyped your collection is based on the data you have provided.";
const NAME_REC_TT_TEXT =
  "These are some similar NFT collections based on the data you have provided.";
const PRICE_REC_TT_TEXT =
  "This is our suggestion for an alternative minting price based on the data you have provided.";

const listItemStyle: SxProps<Theme> = {
  bgcolor: "background.paper",
  boxShadow: (theme: Theme) => theme.shadows[5],
  mb: 1,
  textTransform: "uppercase",
  cursor: "pointer",
};

interface PropsT {
  stepNumber: number;
  generative: boolean;
  state: FormStateI;
  changedMintingPrice: string;
  handleChangeMintingPrice: SetStateAction<string>;
  isLoading: boolean;
}

interface SectionProps {
  title: string;
  tooltipText: string;
  children: ReactNode;
}

const Prediction = ({ title, children, tooltipText }: SectionProps) => (
  <Box alignItems="center" display="flex" justifyContent="space-between">
    <Box alignItems="center" display="flex" gap={2}>
      <Typography color="secondary" variant="h5">
        {title}
      </Typography>
      <InfoTooltip text={tooltipText} />
    </Box>
    {children}
  </Box>
);

const Recommendation = ({ title, children, tooltipText }: SectionProps) => (
  <>
    <Box alignItems="center" display="flex" gap={2}>
      <Typography color="secondary" variant="h5">
        {title}
      </Typography>
      <InfoTooltip text={tooltipText} />
    </Box>
    {children}
  </>
);

/**
 * The form step for the recommendation of the collection name
 * @param state - The state of the form
 * @param stepNumber - The step the form is currently on (must equal
 * REC_STEP_NUMBER_(GEN, STATIC) for this page to render)
 * @param generative - true is the user chose to upload dynamic images, false
 * otherwise (used to determine if this page should number alongside stepNumber)
 * @param changedCollName - Represents changed collection name if user decides
 * to pick a new collection name
 * @param handleChangeCollName - handles collection name change
 */
const RecommendationsStep = ({
  generative,
  stepNumber,
  state,
  handleChangeMintingPrice,
  changedMintingPrice,
  isLoading,
}: PropsT): JSX.Element => {
  if (
    wrongStepStatic(generative, stepNumber, REC_STEP_NUMBER_STATIC) &&
    wrongStepGenerative(generative, stepNumber, REC_STEP_NUMBER_GEN)
  ) {
    return <></>;
  }

  const mintingPriceChange = (newPrice: string) => {
    if (isLoading) {
      return;
    }
    handleChangeMintingPrice(newPrice);
  };

  const RecommendedNamesList = () => {
    return (
      <Carousel>
        {state.predictions.collections.map(({ name, img }, idx) => (
          <Box
            display="flex"
            component="a"
            href={`https://opensea.io/collection/${name}`}
            target="_blank"
            height="60vh"
            key={idx}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              border: (theme) =>
                `2px solid ${getComponentByMode(
                  theme.palette.mode,
                  "black",
                  "white"
                )}`,
              bgcolor: "primary.main",
              borderRadius: "20px",
              textDecoration: "none",
            }}>
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                height: { xs: "50%", md: "100%" },
                borderRadius: { xs: "20px 20px 0 0", md: "20px 0 0 20px" },
                overflow: "hidden",
                backgroundImage: `url(${img === "" ? NoImageFallback : img})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}></Box>
            <Stack
              padding="10px"
              width={{ xs: "100%", md: "50%" }}
              height={{ xs: "50%", md: "100%" }}
              alignItems="center"
              justifyContent="center">
              <Typography
                align="center"
                variant="h2"
                color="black"
                gutterBottom
                noWrap
                width="100%"
                sx={{ fontFamily: "monospace", textTransform: "capitalize" }}>
                {name}
              </Typography>
              <Typography align="center" variant="h6" color="black">
                Click here to see further details of the collections
              </Typography>
            </Stack>
          </Box>
        ))}
      </Carousel>
    );
  };

  const generateHypeExplaination = () => {
    if (state.redditHandle === "" && state.twitterHandle === "") {
      return "Unfortunately, we are unable to calculate the hype of you and your collection as you haven't provided your Twitter or Reddit handles. Please go back and add your usernames to calculate your hype";
    }
    if (state.predictions.hype < BAD_HYPE_UPPER_BOUND) {
      return "Based on the information provided, you should grow the community that are awaiting your next collection!";
    } else if (state.predictions.hype < GOOD_HYPE_UPPER_BOUND) {
      return "Well done, you have a strong community foundation. You can still grow it and reap the benefits";
    }
    return "Wow! You have a huge community awaiting your collection :)";
  };

  return (
    <>
      <PageHeader text="Recommendations" />
      <Prediction title="Hype Evaluation" tooltipText={HYPE_TT_TEXT}>
        <Stack minWidth={300} spacing={2} direction="row" alignItems="center">
          <FireIcon color="info" fontSize="small" />
          <Slider
            aria-label="Hype"
            defaultValue={state.predictions.hype}
            disabled
          />
          <FireIcon color="error" fontSize="large" />
        </Stack>
      </Prediction>
      <Typography>{generateHypeExplaination()}</Typography>
      <Recommendation
        title="Similar Collections"
        tooltipText={NAME_REC_TT_TEXT}>
        <RecommendedNamesList />
      </Recommendation>
      <Recommendation title="Minting Price" tooltipText={PRICE_REC_TT_TEXT}>
        <List>
          <ListItem
            sx={{
              ...listItemStyle,
              border:
                changedMintingPrice === state.mintingPrice
                  ? "3px solid"
                  : "none",
            }}
            onClick={() => mintingPriceChange(state.mintingPrice)}>
            <ListItemText>Old:</ListItemText>
            <ListItemText sx={{ textAlign: "right" }}>
              {state.mintingPrice}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              ...listItemStyle,
              border:
                changedMintingPrice === state.predictions.price
                  ? "3px solid"
                  : "none",
            }}
            onClick={() => mintingPriceChange(state.predictions.price)}>
            <ListItemText>Recommended:</ListItemText>
            <ListItemText sx={{ textAlign: "right" }}>
              {state.predictions.price}
            </ListItemText>
          </ListItem>
        </List>
      </Recommendation>
    </>
  );
};

export default RecommendationsStep;
