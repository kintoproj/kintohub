import React from 'react';
import {
  Switch,
  useLocation,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from 'react-router';
import { Block } from 'types/proto/kkc_models_pb';
import ServiceConsoleLog from 'components/organisms/ServiceConsoleLog';
import ServiceAccess from 'components/organisms/ServiceAccess';
import ServiceCatalogAccess from 'components/organisms/ServiceCatalogAccess';
import ServiceActivity from 'components/organisms/ServiceActivity';
import ServiceMetrics from 'components/organisms/ServiceMetrics';
import ServiceDomains from 'components/organisms/ServiceDomains';
import ServiceSettings from 'components/organisms/ServiceSettings';
import ServiceJobActivity from 'components/organisms/ServiceJobActivity';
import _get from 'lodash.get';

import { VerticalSpacer } from 'components/atoms/Spacer';
import {
  SERVICE_TAB_ACTIVITY,
  SERVICE_TAB_METRICS,
  SERVICE_TAB_CONSOLE,
  SERVICE_TAB_ACCESS,
  SERVICE_TAB_DOMAINS,
  SERVICE_TAB_SETTINGS,
  SERVICE_TAB_JOB_ACTIVITY,
  SERVICE_TAB_CATALOG_ACCESS,
} from 'libraries/constants';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';

type Props = {
  service: Block;
};

const Routes = ({ service, ...rest }: Props) => {
  const location = useLocation();
  const match = useRouteMatch();

  const { latestDeploymentRelease } = useCurrentReleaseState(service);

  return (
    <>
      <Switch location={location}>
        <Route
          path={`${match.url}/${SERVICE_TAB_ACTIVITY}`}
          exact
          render={() => {
            return (
              <>
                <ServiceActivity service={service} />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_ACTIVITY}/release/:releaseId`}
          render={(props: RouteComponentProps) => {
            const releaseId = _get(props, 'match.params.releaseId', '');
            return (
              <>
                <ServiceActivity
                  {...rest}
                  service={service}
                  releaseIdToAction={releaseId}
                />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_SETTINGS}`}
          render={() => {
            return (
              <>
                <ServiceSettings service={service} />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_JOB_ACTIVITY}`}
          render={() => {
            return (
              <>
                <ServiceJobActivity service={service} />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_METRICS}`}
          render={() => {
            return (
              <>
                <ServiceMetrics service={service} />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_CONSOLE}`}
          exact
          render={() => {
            return <ServiceConsoleLog service={service} match={match} />;
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_CONSOLE}/instance/:instanceName`}
          render={(props: RouteComponentProps) => {
            const instanceName = _get(props, 'match.params.instanceName', '');
            return (
              <>
                <ServiceConsoleLog
                  match={match}
                  {...rest}
                  service={service}
                  defaultInstanceName={instanceName}
                />
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_ACCESS}`}
          render={() => {
            return <ServiceAccess service={service} />;
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_DOMAINS}`}
          render={() => {
            return <ServiceDomains service={service} />;
          }}
        />
        <Route
          path={`${match.url}/${SERVICE_TAB_CATALOG_ACCESS}`}
          render={() => {
            return <ServiceCatalogAccess service={service} />;
          }}
        />
        {/* Default route should be metrics */}
        <Route
          render={() => {
            const serviceType =
              latestDeploymentRelease?.getRunconfig()?.getType() ||
              Block.Type.NOT_SET;
            const isStaticSite =
              serviceType === Block.Type.STATIC_SITE ||
              serviceType === Block.Type.JAMSTACK;
            // conditional rendering for the default page
            return (
              <>
                {isStaticSite ? (
                  <ServiceActivity service={service} />
                ) : (
                  <ServiceMetrics service={service} />
                )}
                <VerticalSpacer size={100} />
              </>
            );
          }}
        />
      </Switch>
    </>
  );
};

export default Routes;
