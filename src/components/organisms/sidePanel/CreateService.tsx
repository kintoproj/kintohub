import BackArrowButton from 'components/atoms/BackArrowButton';
import ScrollableTabs from 'components/molecules/ScrollableTabs';
import ServiceTypeButton from 'components/molecules/ServiceTypeButton';
import SidePanelSideBar from 'components/molecules/SidePanelTitleBar';
import {
  CATALOG_MINIO,
  CATALOG_MONGODB,
  CATALOG_MYSQL,
  CATALOG_POSTGRES,
  CATALOG_REDIS,
  CatalogTypes,
} from 'libraries/constants';
import { getSchemaByName } from 'libraries/helpers/catalog';
import {
  getSlidingAnimation,
  getSlidingAnimationBackward,
} from 'libraries/helpers/cssAnimations';
import { initCatalog } from 'libraries/helpers/editService';
import { getServiceIcon, getServiceTypeName } from 'libraries/helpers/service';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { enqueueError } from 'states/app/actions';
import { doHidePanel, showPanel } from 'states/sidePanel/actions';
import { CreateReleaseData } from 'states/sidePanel/types';
import styled from 'styled-components';
import { BlockType } from 'types';
import { Block } from 'types/proto/kkc_models_pb';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import CatalogIcon from '@material-ui/icons/DataUsageRounded';

import ConnectRepoForm from './ConnectRepoForm';

const Container = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  .MuiTab-root {
    text-transform: none;
  }
  .MuiTabs-root {
    padding: 0 16px;
  }
  .content {
    padding: 20px;
    overflow-y: auto;
    height: 100%;
    background-color: ${(props) => props.theme.palette.background.default};
  }
  .spacer {
    margin-bottom: 10px;
  }
  .main {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    transform: translate(0, 0);
    background-color: ${(props) => props.theme.palette.background.paper};
  }
  ${getSlidingAnimation('main')}

  ${getSlidingAnimationBackward(
    'main-backward'
  )}

  // override only selected tab
  .Mui-selected {
    #black {
      fill: ${(props) => props.theme.palette.primary.main};
      fill-opacity: 1;
    }
  }
  background-color: ${(props) => props.theme.palette.background.default};
`;

export interface Props {
  defaultTab?: 'catalog' | 'service';
  defaultType?: BlockType;
  hasReachLimit?: boolean;
}

type ServiceInfo = {
  type: Block.TypeMap[keyof Block.TypeMap];
  description: string;
  isDisabled?: boolean;
  isBeta?: boolean;
  isUnlimited?: boolean;
};

type CatalogInfo = {
  type: CatalogTypes;
  name: string;
  description: string;
  isDisabled: boolean;
  payUserOnly?: boolean;
};

const SERVICES: ServiceInfo[] = [
  // {
  //   type: Block.Type.STATIC_SITE,
  //   description: 'Host a simple website using HTML / Javascript / CSS files.',
  //   isDisabled: true,
  // },
  {
    type: Block.Type.JAMSTACK,
    description:
      'Deploy a website with popular NodeJS static website generator frameworks',
    isBeta: true,
    isUnlimited: true,
  },
  // {
  //   type: Block.Type.JAMSTACK,
  //   description: 'Includes a simple build process that outputs static files usually served on a CDN. Supports popular frameworks such as Gatsby, NextJS, Hexo, etc.',
  //   isDisabled: true,
  // },
  {
    type: Block.Type.WEB_APP,
    description:
      'Deploy a dynamic web app using any language or dockerfile. Supports popular frameworks like Angular, React, Vue.js, etc. ',
    isDisabled: false,
  },
  {
    type: Block.Type.BACKEND_API,
    description:
      'Use RESTful, GraphQL or web sockets to create scalable backend API’s.',
    isDisabled: false,
  },
  {
    type: Block.Type.WORKER,
    description:
      'A continuously running service that consumes events from message queues like Kafka or RabbitMQ. Celery and Sidekiq are also popular background worker frameworks.',
    isDisabled: false,
  },
  {
    type: Block.Type.CRON_JOB,
    description:
      'Schedule cron jobs to run periodically or at fixed time intervals. Otherwise, trigger your job manually at any time.',
    isDisabled: false,
  },
  // {
  //   type: Block.Type.HELM,
  //   description: 'Deploy ready-made helm charts or create your own.',
  //   isDisabled: true,
  // },
];

const CATALOGS: CatalogInfo[] = [
  {
    type: CATALOG_POSTGRES,
    name: 'PostgreSQL',
    description:
      'PostgreSQL is a free and open-source relational database management system (RDBMS) emphasizing extensibility and SQL compliance.',
    isDisabled: false,
  },
  {
    type: CATALOG_MINIO,
    name: 'Minio',
    description:
      'MinIO is a cloud storage server compatible with Amazon S3, released under Apache License v2.',
    isDisabled: false,
    payUserOnly: true,
  },
  {
    type: CATALOG_MYSQL,
    name: 'MySQL',
    description:
      'MySQL is a free and open-source relational database management system (RDBMS) based on SQL.',
    isDisabled: false,
    payUserOnly: true,
  },
  {
    type: CATALOG_MONGODB,
    name: 'MongoDB',
    description:
      'MongoDB is a document-oriented NoSQL database used for high volume data storage.',
    isDisabled: false,
  },
  {
    type: CATALOG_REDIS,
    name: 'Redis',
    description:
      'Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker.',
    isDisabled: false,
  },
];

export default ({ defaultTab, defaultType, hasReachLimit }: Props) => {
  const [tab, setTab] = React.useState(defaultTab === 'catalog' ? 1 : 0);
  // TODO: pass default RepoTab once gitlab is here
  const [repoTab, setRepoTab] = React.useState(0);
  const [type, setType] = React.useState<
    Block.TypeMap[keyof Block.TypeMap] | undefined
  >(defaultType);
  const dispatch = useDispatch();

  const renderServiceTypes = (): React.ReactNode => {
    return (
      <>
        {SERVICES.map((s) => (
          <React.Fragment key={getServiceTypeName(s.type)}>
            <ServiceTypeButton
              data-cy={`create-servicetype-${getServiceTypeName(s.type)
                .replace(' ', '')
                .toLowerCase()}-button`}
              title={`${getServiceTypeName(s.type)}${
                s.isDisabled ? ' (Coming Soon)' : ''
              }`}
              description={s.description}
              icon={getServiceIcon(s.type)}
              onClick={() => {
                setType(s.type);
              }}
              disabled={s.isDisabled}
              isBeta={s.isBeta}
            />
            <div className="spacer" />
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderCatalogTypes = (
    hasReactLimit: boolean | undefined
  ): React.ReactNode => {
    return (
      <>
        {CATALOGS.map((s) => (
          <React.Fragment key={s.type}>
            <ServiceTypeButton
              data-cy={`create-catalog-${s.type}-button`}
              title={`${s.name}${s.isDisabled ? ' (Coming Soon)' : ''}`}
              description={s.description}
              icon={CatalogIcon}
              onClick={() => {
                dispatch(doHidePanel());
                const schema = getSchemaByName(s.type);
                if (!schema) {
                  dispatch(
                    enqueueError(
                      'create-catalog',
                      new Error('catalog is not supported yet.')
                    )
                  );
                  return;
                }
                setTimeout(() => {
                  // create the service and release
                  const service = new Block();
                  const { release } = initCatalog(service, {
                    schema,
                  });
                  const data: CreateReleaseData = {
                    type: 'CREATE_RELEASE',
                    release: release!,
                    service,
                    tabIndex: 0,
                    // for updating the initialValues when restoring edit after billing
                    buildConfig: release?.getBuildconfig()!,
                    runConfig: release?.getRunconfig()!,
                  };
                  dispatch(showPanel(data));
                }, 300);
              }}
              disabled={s.isDisabled}
            />
            <div className="spacer" />
          </React.Fragment>
        ))}
      </>
    );
  };

  const isForward = !!type;
  const animationClassName = isForward ? 'main' : 'main-backward';

  return (
    <Container>
      <TransitionGroup
        className="transition-group"
        childFactory={(child) =>
          React.cloneElement(child, {
            classNames: animationClassName,
          })
        }
      >
        <CSSTransition
          key={type ? '' : `${type}`}
          timeout={{ enter: 300, exit: 300 }}
        >
          {type === undefined ? (
            <div className="main">
              <AppBar color="transparent" position="static" elevation={1}>
                <SidePanelSideBar title="Add Service" />
                <ScrollableTabs
                  tab={tab}
                  setTab={setTab}
                  tabs={[
                    {
                      label: 'Create New',
                    },
                    {
                      label: 'From Catalog',
                    },
                  ]}
                />
              </AppBar>
              <div className="content">
                {tab === 0 && renderServiceTypes()}
                {tab === 1 && renderCatalogTypes(hasReachLimit)}
              </div>
            </div>
          ) : (
            <div className="main">
              <SidePanelSideBar
                title="Connect Repository"
                closeButtonComponent={
                  <BackArrowButton
                    data-cy="create-service-back-button"
                    onClick={() => {
                      setType(undefined);
                    }}
                  />
                }
                onCloseButtonClicked={() => {}}
              />
              <ScrollableTabs
                tab={repoTab}
                setTab={setRepoTab}
                tabs={[
                  {
                    label: 'Import URL',
                  },
                ]}
              />
              <Divider />
              <div className="content">
                {repoTab === 0 && <ConnectRepoForm serviceType={type!} />}
              </div>
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>
    </Container>
  );
};
