import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import Navbar from "components/Navbar";
import CreateNewPage from "pages/CreateNewPage";
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
              <Route exact path="/" component={CreateNewPage} />
            </Container>
          </Box>
        </Switch>
      </Router>
    </>
  );
};

export default App;
