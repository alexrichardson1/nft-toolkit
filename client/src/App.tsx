import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import MintingForm from "components/minting-form/MintingForm";
import Navbar from "components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { mainContainerStyle } from "utils/constants";

const App = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Router>
        <Switch>
          <Box sx={mainContainerStyle}>
            <Container>
              <Route exact path="/" component={MintingForm} />
            </Container>
          </Box>
        </Switch>
      </Router>
    </>
  );
};

export default App;
