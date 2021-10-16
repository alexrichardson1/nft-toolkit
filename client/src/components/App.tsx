import { ThemeProvider } from "@emotion/react";
import { theme } from "context/theme/ThemeContext";
import Home from "pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
