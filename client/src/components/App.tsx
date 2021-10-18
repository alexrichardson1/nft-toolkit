import Home from "pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
