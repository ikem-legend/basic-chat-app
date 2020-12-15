import React from "react"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './index.css'
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import NotFound from "./components/NotFound"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:roomId" component={Chat} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
