import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import genArtImg from "images/generativeIcon.svg";
import staticArtImg from "images/staticIcon.svg";

interface PropsT {
  title: string;
  imgSrc: string;
  description: string;
}

const ChoiceCard = (props: PropsT) => (
  <Grid item xs={12} md={6}>
    <Box>
      <Button>
        <Paper
          sx={{
            padding: 3,
            height: 600,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
          elevation={5}>
          <Typography color="secondary" align="center" variant="h3">
            {props.title}
          </Typography>
          <Box
            sx={{
              height: { xs: "70%", md: 300 },
              width: { xs: "70%", md: 300 },
            }}>
            <img
              style={{
                height: "100%",
                width: "100%",
              }}
              src={props.imgSrc}
              alt={`${props.title}-img`}
            />
          </Box>
          <Typography
            variant="h6"
            color="primary"
            sx={{ textAlign: "left", textTransform: "none" }}>
            {props.description}
          </Typography>
        </Paper>
      </Button>
    </Box>
  </Grid>
);

const GEN_ART_DESC =
  "Dynamically generate an NFT collection of multi-layered images.Provide layers you want each NFT to include, upload your images with respective rarities. Let us generate your NFTs via smart contracts and deploy the collection!";

const STATIC_ART_DESC =
  "Create a static NFT collection. Upload all your images, give each a name and description. Finally, let us generate your NFTs via smart contracts and deploy the collection!";

const TypeOfArtStep = (): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <ChoiceCard
        imgSrc={genArtImg}
        description={GEN_ART_DESC}
        title="Generative Art"
      />
      <ChoiceCard
        imgSrc={staticArtImg}
        description={STATIC_ART_DESC}
        title="Static Art"
      />
    </Grid>
  );
};

export default TypeOfArtStep;
