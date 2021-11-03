import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const TypeOfArtStep = (): JSX.Element => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={10} md={4}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              margin: 1,
              width: 400,
              height: 400,
            },
          }}>
          <Button
            sx={{
              background:
                'url("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg")',
              backgroundSize: "100 400",
              backgroundRepeat: "no-repeat",
            }}
            variant="outlined"></Button>
        </Box>
      </Grid>
      <Grid item xs={10} md={4}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              margin: 1,
              width: 400,
              height: 400,
            },
          }}>
          <Button variant="outlined">
            <Paper elevation={3}></Paper>
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TypeOfArtStep;
