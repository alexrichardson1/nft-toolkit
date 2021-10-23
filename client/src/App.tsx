import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import CreateCollectionForm from "components/create-collection-form/CreateCollectionForm";
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
              <Route exact path="/" component={CreateCollectionForm} />
            </Container>
          </Box>
        </Switch>
      </Router>
    </>
  );
};

export default App;
