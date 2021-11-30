import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

interface PropsT {
  data: CardInfoI;
}

const dummy: CardInfoI = {
  name: "APE 0",
  description: "",
  image:
    "https://media4.giphy.com/media/30NdmWTV6ORPuwUNUu/giphy.gif?cid=ecf05e47auja74quh6utc1i80lc2j3zfqbr15vnql5o5tg3r&rid=giphy.gif&ct=g",
  // eslint-disable-next-line camelcase
  attributes: { tier: "Legendary" },
};

const DisplayCard = (_props: PropsT): JSX.Element => {
  return (
    <Card sx={{ maxHeight: 400, maxWidth: 300 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={dummy.image}
          alt={dummy.name}
        />
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography
              gutterBottom={dummy.description.length > 0}
              variant="h5"
              color="primary">
              {dummy.name}
            </Typography>
            <Typography variant="h5">{dummy.attributes.tier}</Typography>
          </Box>
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              lineClamp: 2,
              WebkitLineClamp: "5",
              WebkitBoxOrient: "vertical",
            }}
            variant="body2">
            {dummy.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DisplayCard;
