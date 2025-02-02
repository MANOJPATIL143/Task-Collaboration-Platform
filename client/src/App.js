
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import Main from "./components/layout/Main";
import Profile from "./components/pages/Profile";
import Membeers from "./components/pages/Member";

import TaskList from "./components/Masters/TaskList";
import TeamList from "./components/Masters/TeamsList";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  const token = sessionStorage.getItem("token");
  return (
    <div className="App">
    <Switch>

      <Route path="/sign-up" exact component={SignUp} />
      <Route path="/sign-in" exact component={SignIn} />
      {token && (
        <Main>
          <Route path="/home" exact component={Home} />
          <Route path="/tasks" exact component={TaskList} />
          <Route path="/teams" exact component={TeamList} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/members" exact component={Membeers} />
        </Main>
      )}

      <Redirect from="*" to={token ? "/home" : "/sign-in"} />
    </Switch>
  </div>
  );
}

export default App;
