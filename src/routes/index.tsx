import EnvRedirect from 'components/pages/EnvRedirect';
import ListServices from 'components/pages/ListServices';
import Maintenance from 'components/pages/Maintenance';
import ManageService from 'components/pages/ManageService';
import NotFound from 'components/pages/NotFound';
import AuthApp from 'components/templates/app/AuthApp';
import LandingLayout from 'components/templates/layouts/LandingLayout';
import MenuLayout from 'components/templates/layouts/MenuLayout';
import { PATH_CREATE_ENV, PATH_MAINTENANCE } from 'libraries/constants';
import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { TransitionGroup } from 'react-transition-group';
import EnvironmentApp from 'components/templates/app/EnvironmentApp';
import CreateFirstEnv from 'components/pages/CreateFirstEnv';
import LoginPage from '../components/pages/LoginPage';

const Routes = () => {
  const location = useLocation();

  // For nested route we use component={} instead of {children} only because it looks nicer
  // Inside the child component we use useLocation/useMatch hooks anyway
  return (
    <TransitionGroup>
      <Switch location={location}>
        <Route path="/auth">
          <LandingLayout>
            <LoginPage />
          </LandingLayout>
        </Route>

        <Route path="/app">
          <AuthApp>
            <MenuLayout>
              <Switch>
                <Route path="/app/environment/:envId">
                  <EnvironmentApp>
                    <Switch>
                      <Route
                        path="/app/environment/:envId/services"
                        exact
                        component={ListServices}
                      />
                      <Route
                        path="/app/environment/:envId/services/:serviceId/manage"
                        component={ManageService}
                      />
                    </Switch>
                  </EnvironmentApp>
                </Route>
                <Route component={EnvRedirect} />
              </Switch>
            </MenuLayout>
          </AuthApp>
        </Route>

        <Route path={PATH_CREATE_ENV}>
          <LandingLayout>
            <CreateFirstEnv />
          </LandingLayout>
        </Route>

        <Route path={PATH_MAINTENANCE}>
          <LandingLayout>
            <Maintenance />
          </LandingLayout>
        </Route>

        {/* Fallback to /app/ for home */}
        <Route path="/" exact>
          <Redirect to="/app" />
        </Route>

        {/* default route */}
        <Route>
          <LandingLayout>
            <NotFound />
          </LandingLayout>
        </Route>
      </Switch>
    </TransitionGroup>
  );
};

export default Routes;
