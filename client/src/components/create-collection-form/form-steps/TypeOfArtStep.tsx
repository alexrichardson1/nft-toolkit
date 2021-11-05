import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import genArtImg from "images/generativeIcon.svg";
import staticArtImg from "images/staticIcon.svg";

interface CardPropsT {
  title: string;
  imgSrc: string;
  description: JSX.Element;
  handleCardClick: () => void;
}

const ChoiceCard = (props: CardPropsT) => {
  return (
    <Grid item xs={12} md={6}>
      <Box>
        <Button onClick={props.handleCardClick}>
          <Paper
            sx={{
              padding: 3,
              height: 600,
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
            elevation={5}>
            <Typography color="secondary" align="center" variant="h3">
              {props.title}
            </Typography>
            <Box
              sx={{
                height: 200,
                width: 300,
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
};

const GEN_ART_DESC = (
  <>
    Dynamically generate an NFT collection using multi-layered images
    <ul style={{ marginTop: 0, marginBottom: 0 }}>
      <li> Provide layers you wish each NFT to include</li>
      <li> Upload your images for each layer with respective rarities</li>
      <li>
        Sit back whilst we generate your NFTs via smart contracts and deploy the
        collection!
      </li>
    </ul>
  </>
);

const STATIC_ART_DESC = (
  <>
    Create a static NFT collection
    <ul style={{ marginTop: 0, marginBottom: 0 }}>
      <li>Upload all of your static images</li>
      <li>Give each image a name and a description</li>
      <li>
        Sit back whilst we generate your NFTs via smart contracts and deploy the
        collection!
      </li>
    </ul>
  </>
);

interface PropsT {
  pageNumber: number;
  handleNextPage: () => void;
  setGenerative: React.Dispatch<React.SetStateAction<boolean>>;
}

const PAGE_1 = 1;

const TypeOfArtStep = ({
  setGenerative,
  handleNextPage,
  pageNumber,
}: PropsT): JSX.Element => {
  if (pageNumber !== PAGE_1) {
    return <></>;
  }

  return (
    <Grid container spacing={2}>
      <ChoiceCard
        handleCardClick={() => {
          setGenerative(true);
          handleNextPage();
        }}
        imgSrc={genArtImg}
        description={GEN_ART_DESC}
        title="Generative Art"
      />
      <ChoiceCard
        handleCardClick={handleNextPage}
        imgSrc={staticArtImg}
        description={STATIC_ART_DESC}
        title="Static Art"
      />
    </Grid>
  );
};

export default TypeOfArtStep;
