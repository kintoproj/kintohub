import React from 'react';
import {
  CreateDomainData,
  EditReleaseData,
  SidePanelActionDataTypes,
  ViewReleaseLogData,
} from 'states/sidePanel/types';
import { Block } from 'types/proto/models_pb';

import BuildLog from './BuildLog';
import CreateDomain from './CreateDomain';
import CreateEnv from './CreateEnv';
import CreateService from './CreateService';
import EditCatalog from './EditCatalog';
import EditEnv from './EditEnv';
import EditService from './EditService';

interface Props {
  data: SidePanelActionDataTypes;
}

export default ({ data }: Props) => {
  switch (data?.type) {
    case 'CREATE_SERVICE':
      return (
        <CreateService
          defaultTab={data.tab}
          defaultType={data.serviceType}
          hasReachLimit={data.hasReachLimit}
        />
      );
    case 'VIEW_LOGS':
      return (
        <BuildLog
          release={(data as ViewReleaseLogData).release}
          service={(data as ViewReleaseLogData).service}
        />
      );
    case 'CREATE_RELEASE':
    case 'EDIT_RELEASE': {
      const {
        release,
        service,
        fieldErrors,
        tabIndex,
      } = data as EditReleaseData;
      if (release.getRunconfig()?.getType() === Block.Type.CATALOG) {
        return (
          <EditCatalog
            isCreate={data?.type === 'CREATE_RELEASE'}
            release={release}
            service={service}
            fieldErrors={fieldErrors}
            buildConfig={data.buildConfig}
            runConfig={data.runConfig}
            tabIndex={tabIndex}
          />
        );
      }

      return (
        <EditService
          isCreate={data?.type === 'CREATE_RELEASE'}
          release={release}
          service={service}
          fieldErrors={fieldErrors}
          tabIndex={data.tabIndex}
          buildConfig={data.buildConfig}
          runConfig={data.runConfig}
        />
      );
    }
    case 'CREATE_ENV':
      return <CreateEnv />;
    case 'EDIT_ENV':
      return <EditEnv envId={data.envId} hasServices={data.hasServices} />;
    case 'CREATE_DOMAIN':
      return <CreateDomain data={data as CreateDomainData} />;
    default:
      return null;
  }
};
