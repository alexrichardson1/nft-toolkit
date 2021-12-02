import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MAX_RARITY = 100;

const getProgressText = (rarityDiff: number) => {
  if (rarityDiff < 0) {
    return `You are ${Math.abs(rarityDiff)}% over the required amount`;
  }
  if (rarityDiff > 0) {
    return `You have ${rarityDiff}% left to assign`;
  }
  return "You have reached the required amount";
};

const getProgressColour = (rarityDiff: number) => {
  if (rarityDiff < 0) {
    return "error";
  }
  if (rarityDiff > 0) {
    return "primary";
  }
  return "success";
};

interface PropsT {
  totalRarity: number;
}

const RarityProgressBar = ({ totalRarity }: PropsT): JSX.Element => {
  const rarityDiff = MAX_RARITY - totalRarity;
  return (
    <Box mb={2} width={1}>
      <Typography align="right">{getProgressText(rarityDiff)}</Typography>
      <LinearProgress
        color={getProgressColour(rarityDiff)}
        sx={{ height: 20 }}
        variant="determinate"
        value={totalRarity}
      />
    </Box>
  );
};

export default RarityProgressBar;
