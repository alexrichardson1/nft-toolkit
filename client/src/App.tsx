import Navbar from "components/Navbar";
import Home from "pages/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
