import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import genArtImg from "images/generativeIcon.svg";
import staticArtImg from "images/staticIcon.svg";
import { LinkContainer } from "react-router-bootstrap";

const TypeOfArtStep = (): JSX.Element => {
  return (
    <Grid container justifyContent="center" spacing={4} alignItems="center">
      <Grid item xs={10} md={5}>
        <Button>
          <Paper elevation={5}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  margin: 1,
                  width: 400,
                  height: 500,
                },
              }}>
              <LinkContainer to="/">
                <Box>
                  <Typography align="center" variant="h4" component="div">
                    Generative Art
                  </Typography>
                  <img
                    style={{
                      height: 300,
                      width: 300,
                    }}
                    src={genArtImg}
                  />
                  <Typography variant="body1" component="div">
                    Dynamically generate an NFT collection of multi-layered
                    images. Select the layers you want each image to include,
                    Upload your pictures with a rarity for each one. Finally,
                    let us generate your NFTs via smart contracts and deploy the
                    collection!
                  </Typography>
                </Box>
              </LinkContainer>
            </Box>
          </Paper>
        </Button>
      </Grid>
      <Grid item xs={10} md={5}>
        <Button>
          <Paper elevation={5}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  margin: 1,
                  width: 400,
                  height: 500,
                },
              }}>
              <LinkContainer to="/">
                <Box>
                  <Typography align="center" variant="h4" component="div">
                    Static Art
                  </Typography>
                  <img
                    style={{
                      height: 300,
                      width: 300,
                    }}
                    src={staticArtImg}
                  />
                  <Typography variant="body1" component="div">
                    Create a static NFT collection. Upload all your images, give
                    each a name and description. Finally, let us generate your
                    NFTs via smart contracts and deploy the collection!
                  </Typography>
                </Box>
              </LinkContainer>
            </Box>
          </Paper>
        </Button>
      </Grid>
    </Grid>
  );
};

export default TypeOfArtStep;
