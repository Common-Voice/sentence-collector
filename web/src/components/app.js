import React from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { getLanguages } from '../actions/languages';
import { login } from '../actions/login';

import Page from './page';
import Home from './pages/home';
import HowTo from './pages/how-to';
import Login from './pages/login';
import Profile from './pages/profile';
import Rejected from './pages/rejected';
import Add from './pages/add';
import Review from './pages/review';

class App extends React.Component {
  constructor(props) {
    super(props);

    const {
      username,
      password,
      login,
      getLanguages,
    } = props;

    if (username && password) {
      login(username, password);
    }

    getLanguages();
  }

  render() {
    const { history, authed } = this.props;
    return (
      <ConnectedRouter history={history}>
        <Page>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/how-to" component={HowTo} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact authed={authed} path="/profile" component={Profile} />
            <PrivateRoute exact authed={authed} path="/add" component={Add} />
            <PrivateRoute exact authed={authed} path="/review" component={Review} />
            <PrivateRoute authed={authed} path="/review/:language" component={Review} />
            <PrivateRoute authed={authed} path="/rejected" component={Rejected} />
            <Route render={() => (
              <Redirect to={{ pathname: "/", }} />
            )} />
          </Switch>
        </Page>
      </ConnectedRouter>
    );
  }
}

const PrivateRoute = (props) => {
  const Component = props.component;
  const authed = props.authed;
  return <Route
    path={props.path}
    render={props =>
      authed ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />;
};

function mapDispatchToProps(dispatch) {
  return {
    getLanguages: () => dispatch(getLanguages()),
    login: (username, password) => dispatch(login(username, password)),
  };
}

function mapStateToProps(state) {
  return {
    authed: state.login.authed,
    username: state.login.username,
    password: state.login.password,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);