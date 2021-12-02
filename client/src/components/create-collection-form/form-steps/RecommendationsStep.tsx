import FireIcon from "@mui/icons-material/LocalFireDepartment";
import { List, ListItem, ListItemText, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import Box from "@mui/system/Box";
import InfoTooltip from "components/common/InfoToolTip";
import PageHeader from "components/common/PageHeader";
import { ReactNode } from "react";
import { wrongStepGenerative, wrongStepStatic } from "utils/pages";

const REC_STEP_NUMBER_STATIC = 3;
const REC_STEP_NUMBER_GEN = 5;
const MAX_HYPE = 5;
const HYPE_TT_TEXT =
  "This indicates how well we think your collection will do based on the data you have provided.";
const NAME_REC_TT_TEXT =
  "These are some suggestions for alternative names based on the data you have provided.";

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
  handleChangeCollName: SetStateAction<string>;
  changedCollName: string;
}

interface SectionProps {
  title: string;
  tooltipText: string;
  children: ReactNode;
}

const Prediction = ({ title, children, tooltipText }: SectionProps) => (
  <Box alignItems="center" display="flex" justifyContent="space-between">
    <Box alignItems="center" display="flex" gap={2}>
      <Typography>{title}</Typography>
      <InfoTooltip text={tooltipText} />
    </Box>
    {children}
  </Box>
);

const Recommendation = ({ title, children, tooltipText }: SectionProps) => (
  <>
    <Box alignItems="center" display="flex" gap={2}>
      <Typography>{title}</Typography>
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
  handleChangeCollName,
  changedCollName,
}: PropsT): JSX.Element => {
  // TODO: connect with ML
  if (
    wrongStepStatic(generative, stepNumber, REC_STEP_NUMBER_STATIC) &&
    wrongStepGenerative(generative, stepNumber, REC_STEP_NUMBER_GEN)
  ) {
    return <></>;
  }

  return (
    <>
      <PageHeader text="Predictions & Recommendations" />
      <Typography color="primary" variant="h5">
        Predictions
      </Typography>
      <Prediction title="Predicted Hype" tooltipText={HYPE_TT_TEXT}>
        <Box display="flex" alignItems="center" gap={1}>
          {Array.from(Array(MAX_HYPE).keys()).map((idx) => (
            <FireIcon
              key={idx}
              {...(state.predictions.hype > idx && { color: "primary" })}
            />
          ))}
        </Box>
      </Prediction>
      <Typography color="primary" variant="h5">
        Recommendations
      </Typography>
      <Recommendation title="Collection Name" tooltipText={NAME_REC_TT_TEXT}>
        <List>
          <ListItem
            onClick={() => handleChangeCollName(state.collectionName)}
            sx={{
              ...listItemStyle,
              border:
                changedCollName === state.collectionName ? "3px solid" : "none",
            }}>
            <ListItemText>{state.collectionName}</ListItemText>
          </ListItem>
          {state.predictions.names.map((nameObj, idx) => {
            return (
              <ListItem
                onClick={() => handleChangeCollName(nameObj.name)}
                sx={{
                  ...listItemStyle,
                  border:
                    changedCollName === nameObj.name ? "3px solid" : "none",
                }}
                key={idx}>
                <ListItemText>{nameObj.name}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Recommendation>
    </>
  );
};

export default RecommendationsStep;
