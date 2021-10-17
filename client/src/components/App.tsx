import ThemeProvider from "context/theme/ThemeProvider";
import Home from "pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = (): JSX.Element => {
  return (
    <ThemeProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
