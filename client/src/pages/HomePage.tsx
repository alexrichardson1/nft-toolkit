import BrushIcon from "@mui/icons-material/Brush";
import { Button, Stack, Typography } from "@mui/material";
import SvgIcon from "components/common/SvgLogo";
import Logo from "images/hero-art.svg";
import { Link } from "react-router-dom";

const HomePage = (): JSX.Element => {
  return (
    <Stack gap="10px" direction="row" width={1} minHeight="100%">
      <Stack
        gap={3}
        alignItems="flex-start"
        justifyContent="center"
        width={0.5}
        minHeight="100%">
        <Typography width={1} variant="h3">
          Welcome to NFToolkit
        </Typography>
        <Typography fontSize="1.2em">
          We help you to create static and dynamic NFT collections effortlessly.
          Create a new collection now and sit back while we deploy them to
          OpenSea and our personalised marketplace for you!
        </Typography>
        <Button
          to="create-new-collection"
          component={Link}
          size="large"
          startIcon={<BrushIcon />}
          variant="contained">
          Create a New Collection
        </Button>
      </Stack>
      <Stack gap={3} alignItems="center" justifyContent="center" width={0.5}>
        <SvgIcon width="100%" height="auto" icon={Logo} alt="logo" />
      </Stack>
    </Stack>
  );
};

export default HomePage;
