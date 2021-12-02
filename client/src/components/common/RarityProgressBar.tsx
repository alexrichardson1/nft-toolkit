import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MAX_RARITY = 100;

const getProgressText = (totalRarity: number) => {
  const rarityDiff = MAX_RARITY - totalRarity;
  if (rarityDiff < 0) {
    return `You are ${Math.abs(rarityDiff)}% over the required amount`;
  }
  if (rarityDiff > 0) {
    return `You have ${rarityDiff}% left to assign`;
  }
  return "You have reached the required amount";
};
interface PropsT {
  totalRarity: number;
}

const RarityProgressBar = ({ totalRarity }: PropsT): JSX.Element => {
  return (
    <Box mb={2} width={1}>
      <Typography align="right">{getProgressText(totalRarity)}</Typography>
      <LinearProgress
        color={totalRarity === MAX_RARITY ? "primary" : "error"}
        sx={{ height: 20 }}
        variant="determinate"
        value={totalRarity}
      />
    </Box>
  );
};

export default RarityProgressBar;
