import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system";
import { DEFAULT_PADDING } from "utils/constants";

const BOX_HEIGHT = 200;
const BOX_WIDTH = 300;
const CHOICE_CARD_HEIGHT = 600;

const choiceCardContainerStyle = { bgcolor: "background.paper" };
const choiceCardBoxStyle = { height: BOX_HEIGHT, width: BOX_WIDTH };
const imgStyle = { height: "100%", width: "100%" };
const descriptionStyle: SxProps = { textAlign: "left", textTransform: "none" };
const choiceCardStyle: SxProps = {
  padding: DEFAULT_PADDING,
  height: CHOICE_CARD_HEIGHT,
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "25px",
};
interface CardPropsT {
  title: string;
  imgSrc: string;
  description: JSX.Element;
  handleCardClick: () => void;
}

const ChoiceCard = (props: CardPropsT): JSX.Element => {
  return (
    <Grid item xs={12} md={6}>
      <Box sx={choiceCardContainerStyle}>
        <Button onClick={props.handleCardClick}>
          <Paper sx={choiceCardStyle} elevation={5}>
            <Typography color="secondary" align="center" variant="h3">
              {props.title}
            </Typography>
            <Box sx={choiceCardBoxStyle}>
              <img
                style={imgStyle}
                src={props.imgSrc}
                alt={`${props.title}-img`}
              />
            </Box>
            <Typography variant="h6" color="primary" sx={descriptionStyle}>
              {props.description}
            </Typography>
          </Paper>
        </Button>
      </Box>
    </Grid>
  );
};

export default ChoiceCard;
