import 'types/proto.extend/block';

import { HorizontalSpacer } from 'components/atoms/Spacer';
import TextButton from 'components/atoms/TextButton';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import AlertDialog from 'components/molecules/AlertDialog';
import EmptyTableRow from 'components/molecules/EmptyTableRow';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import {
  checkCustomDomainName,
  deleteCustomDomainName,
} from 'libraries/grpc/release';
import _omit from 'lodash.omit';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueError, setLoading } from 'states/app/actions';
import { AuthState } from 'states/auth/types';
import { removeDomain } from 'states/service/actions';
import { ServiceState } from 'states/service/types';
import { showPanel } from 'states/sidePanel/actions';
import { CreateDomainData } from 'states/sidePanel/types';
import { RootState } from 'states/types';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';
import * as Yup from 'yup';

import { Card, List, ListItem, Popover } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreHorizRounded';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

const ContainerDiv = styled.div`
  .MuiTableHead-root,
  .MuiTableFooter-root {
    background-color: ${(props) => props.theme.palette.grey[50]};
  }
  .MuiInputBase-input {
    background-color: ${(props) => props.theme.palette.background.paper};
    min-width: 300px;
  }
  tbody {
  }
  .MuiCard-root {
    margin-top: 16px;
    padding: 40px;
    input {
      min-width: 400px;
    }
  }
  .add-domain-row {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .no-bottom-border {
    border-bottom: none;
  }
  .MuiChip-root {
    text-transform: none;
    span {
      font-family: Roboto;
      font-size: 12px;
      letter-spacing: 0.18px;
    }
  }
  .success {
    background-color: ${(props) => props.theme.palette.success.light};
    color: ${(props) => props.theme.palette.error.contrastText};
  }
  .error {
    background-color: ${(props) => props.theme.palette.error.light};
    color: ${(props) => props.theme.palette.error.contrastText};
  }
`;

type DomainStatus = {
  domain: string;
  status: 'Verified' | 'Invalid DNS';
  sslReady: boolean;
};

interface LocalState {
  [domain: string]: DomainStatus;
}

const initialState: LocalState = {};

type LocalDispatchAction =
  | {
      type: 'add';
      status: DomainStatus;
    }
  | {
      type: 'remove';
      domain: string;
    };

const reducer = (
  state: LocalState,
  action: LocalDispatchAction
): LocalState => {
  switch (action.type) {
    case 'add': {
      return {
        ...state,
        [action.status.domain]: action.status,
      };
    }
    case 'remove':
      return _omit(state, action.domain);
  }
  return state;
};

const ServiceActivity = ({ service }: Props) => {
  const dispatch = useDispatch();
  const [domainToAdd, setDomainToAdd] = useState('');
  const [domainToAddError, setDomainToAddError] = useState<string | null>(null);
  const [domainToEdit, setDomainToEdit] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { envId } = useSelector<RootState, AuthState>(
    (state: RootState) => state.auth
  );

  const { domains } = useSelector<RootState, ServiceState>(
    (state: RootState) => state.service
  );

  const [localState, localDispatch] = useReducer(reducer, initialState);
  const { liveRelease } = useCurrentReleaseState(service);

  const grpcWrapper = useGRPCWrapper();

  const checkAndAddDomain = () => {
    Yup.string()
      .domain()
      .fieldRequired('domain')
      .validate(domainToAdd)
      .then(() => {
        const createDomainData: CreateDomainData = {
          type: 'CREATE_DOMAIN',
          domain: domainToAdd,
          cnameValue: liveRelease?.getRunconfig()?.getHost()!,
          serviceName: service.getName(),
        };
        dispatch(showPanel(createDomainData));
      })
      .catch((error) => {
        setDomainToAddError(error.errors[0]);
      });
  };

  const queryDomainStatus = async (domain: string, forceVerified?: boolean) => {
    try {
      const resp = await grpcWrapper(checkCustomDomainName, {
        domainName: domain,
        cname: liveRelease?.getRunconfig()?.getHost()!,
        serviceName: service.getName(),
        envId: envId!,
      });
      // TODO: this is a hacky fix to avoid the status flipping
      let status: 'Verified' | 'Invalid DNS' = resp.getIscnameok()
        ? 'Verified'
        : 'Invalid DNS';
      if (forceVerified) {
        status = 'Verified';
      }
      localDispatch({
        type: 'add',
        status: {
          domain,
          status,
          sslReady: resp.getIscertificateready(),
        },
      });
    } catch (error) {
      localDispatch({
        type: 'add',
        status: {
          domain,
          status: 'Invalid DNS',
          sslReady: false,
        },
      });
    }
  };

  useEffect(() => {
    domains.forEach((domain) => queryDomainStatus(domain));
  }, [domains]);

  const removeCustomDomain = async (domain: string) => {
    dispatch(setLoading(true));
    try {
      grpcWrapper(deleteCustomDomainName, {
        domainName: domain,
        cname: liveRelease?.getRunconfig()?.getHost()!,
        serviceName: service.getName(),
        envId: envId!,
      });
      dispatch(removeDomain(domain));
    } catch (error) {
      dispatch(enqueueError('delete-custom-domain', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // We hide the renderStatus for now. Until we have a proper fix for the cloudflare naked domain
  // const renderStatusForDomain = (domain: string) => {
  //   const status = localState[domain];
  //   if (status === undefined) {
  //     return <CircularProgress color="primary" size={30} />;
  //   }
  //   return (
  //     <Chip
  //       className={status.status === 'Verified' ? 'success' : 'error'}
  //       label={status.status}
  //       size="small"
  //     />
  //   );
  // };

  const renderSSLForDomain = (domain: string) => {
    const status = localState[domain];
    if (status === undefined) {
      return <></>;
    }
    return (
      <Typography variant="body2">
        {status.sslReady ? 'Active' : 'Pending'}
      </Typography>
    );
  };

  const renderPopOver = (domain: string) => {
    const status = localState[domain];

    return (
      <>
        <List>
          {(!status || status.status !== 'Verified' || !status.sslReady) && (
            <ListItem
              button
              onClick={() => {
                setAnchorEl(null);
                // clear the status and show the loading
                localDispatch({
                  type: 'remove',
                  domain,
                });
                setTimeout(() => {
                  queryDomainStatus(domain, status.status === 'Verified');
                }, 2000);
              }}
            >
              <Typography variant="body2">Refresh</Typography>
            </ListItem>
          )}
          {(!status || status.status !== 'Verified') && (
            <ListItem
              button
              onClick={() => {
                setAnchorEl(null);
                const createDomainData: CreateDomainData = {
                  type: 'CREATE_DOMAIN',
                  domain,
                  cnameValue: liveRelease?.getRunconfig()?.getHost()!,
                  serviceName: service.getName(),
                  readOnly: true,
                };
                dispatch(showPanel(createDomainData));
              }}
            >
              <Typography variant="body2">Setup Info</Typography>
            </ListItem>
          )}
          <ListItem
            button
            onClick={() => {
              setAnchorEl(null);
              setIsDialogOpen(true);
            }}
          >
            <Typography variant="body2">Remove</Typography>
          </ListItem>
        </List>
      </>
    );
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const popOpened = !!anchorEl;
  const popOverId = popOpened ? 'simple-popover' : undefined;

  /**
   * ======         Main render function     ======
   */
  return (
    <ContainerDiv>
      <TableContainer component={Paper}>
        <Table className="table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={10} className="no-bottom-border">
                <div className="add-domain-row">
                  <TextField
                    placeholder="yourwebsite.com"
                    variant="outlined"
                    size="small"
                    error={!!domainToAddError}
                    helperText={domainToAddError}
                    onChange={(evt) => {
                      setDomainToAdd(evt.target.value);
                      setDomainToAddError(null);
                    }}
                  />
                  <HorizontalSpacer size={16} />
                  <TextButton
                    data-cy="add-domain-button"
                    variant="outlined"
                    color="primary"
                    text="Add Domain"
                    onClick={checkAndAddDomain}
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="condensed-col">
                <Typography variant="overline">DOMAIN</Typography>
              </TableCell>
              {/* <TableCell className="condensed-col" align="left">
                <Typography variant="overline">
                  CNAME
                </Typography>
              </TableCell> */}
              <TableCell align="left">
                <Typography variant="overline">SSL Status</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.length === 0 && (
              <EmptyTableRow text="No domains added yet" colSpan={4} />
            )}
            {domains.map((domain) => (
              <TableRow key={domain}>
                <TableCell className="condensed-col">
                  <Typography variant="body2">{domain}</Typography>
                </TableCell>
                {/* <TableCell className="condensed-col" align="left">
                  {renderStatusForDomain(domain)}
                </TableCell> */}
                <TableCell align="left">{renderSSLForDomain(domain)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(evt) => {
                      setAnchorEl(evt.currentTarget);
                      setDomainToEdit(domain);
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Popover
        id={popOverId}
        open={popOpened}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Card>{renderPopOver(domainToEdit!)}</Card>
      </Popover>
      <AlertDialog
        title={`Remove ${domainToEdit}?`}
        text="This domain will no longer be associated with this service."
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        confirmText="REMOVE"
        cancelText="CANCEL"
        onConfirm={() => {
          removeCustomDomain(domainToEdit!);
          setDomainToEdit(null);
        }}
        onCancel={() => {
          setDomainToEdit(null);
        }}
      />
    </ContainerDiv>
  );
};

export default ServiceActivity;
