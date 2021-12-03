import { Collapse, LinearProgress } from "@mui/material";
import Container from "@mui/material/Container";
import { SxProps } from "@mui/system";
import Box from "@mui/system/Box";
import Market from "components/marketplace/Market";
import PurchasePage from "components/marketplace/PurchasePage";
import Navbar from "components/navbar/Navbar";
import { useAppSelector } from "hooks/useAppSelector";
import CreateCollectionPage from "pages/CreateCollectionPage";
import Error404Page from "pages/Error404";
import MintingPage from "pages/MintingPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NAVBAR_HEIGHT } from "utils/constants";

const mainContainerStyle = {
  py: 3,
  width: 1,
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
  bgcolor: "background.default",
  color: "text.primary",
  display: "flex",
};

const containerStyle: SxProps = {
  flexDirection: "column",
  display: "flex",
  flexGrow: 1,
};

const App = (): JSX.Element => {
  const { inProgress, progressAmount } = useAppSelector(
    (state) => state.linearProgress
  );

  return (
    <>
      <Router>
        <Navbar />
        <Box sx={mainContainerStyle}>
          <Container sx={containerStyle}>
            <Collapse in={inProgress}>
              <LinearProgress variant="determinate" value={progressAmount} />
            </Collapse>
            <Switch>
              <Route
                exact
                path="/:paramChainId/:address([0-9a-zA-Z]{26,})"
                component={MintingPage}
              />
              <Route
                exact
                path="/:paramChainId/:address([0-9a-zA-Z]{26,})/:marketAddress([0-9a-zA-Z]{26,})"
                component={Market}
              />
              <Route exact path="/" component={CreateCollectionPage} />
              <Route
                exact
                path="/:paramChainId/:address([0-9a-zA-Z]{26,})/:marketAddress([0-9a-zA-Z]{26,})/:tokenId([0-9]+)"
                component={PurchasePage}
              />
              <Route component={Error404Page} />
            </Switch>
          </Container>
        </Box>
      </Router>
    </>
  );
};

export default App;
