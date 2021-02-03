import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import SidePanelTitleBar from 'components/molecules/SidePanelTitleBar';
import Container from 'components/atoms/ContentContainer';
import styled from 'styled-components';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { bps } from 'theme';
import { Tooltip, IconButton } from '@material-ui/core';
import ErrorOutlineRounded from '@material-ui/icons/ErrorOutlineRounded';
import CopyToClipboard from 'react-copy-to-clipboard';
import CopyIcon from '@material-ui/icons/FileCopyRounded';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { SeparatedRow } from 'components/atoms/Row';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'states/types';
import { AuthState } from 'states/auth/types';
import { createCustomDomainName } from 'libraries/grpc/release';
import { doHidePanel } from 'states/sidePanel/actions';
import { insertDomain } from 'states/service/actions';
import { CreateDomainData } from 'states/sidePanel/types';

type Props = {
  data: CreateDomainData;
};

const StyledDiv = styled.div`
  height: 100%;
  width: 75vw;
  display: flex;
  flex-direction: column;
  ${bps.down('md')} {
    width: 100vw;
  }
  color: ${(props) => props.theme.palette.text.secondary};

  .table-header {
    background-color: ${(props) => props.theme.palette.grey[50]};
  }
  .MuiTableBody-root {
    background-color: ${(props) => props.theme.palette.background.default};
    .MuiSvgIcon-root {
      width: 0.8em;
      height: 0.8em;
    }
  }
  .error-text {
    display: block;
    span {
      text-transform: none;
    }
    color: ${(props) => props.theme.palette.error.main};
    svg {
      height: 14px;
      width: 14px;
      margin-right: 4px;
    }
    .bold {
      font-weight: 800;
    }
  }
`;

export default ({
  data: { domain, cnameValue, serviceName, readOnly },
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [invalidCNAME, setInvalidCNAME] = useState('');
  const [expectedCNAME, setExpectedCNAME] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const grpcWrapper = useGRPCWrapper();
  const { envId } = useSelector<RootState, AuthState>(
    (state: RootState) => state.auth
  );

  const checkAndCreateDomain = async () => {
    // reset all the errors first
    setErrorMessage('');
    setExpectedCNAME('');
    setInvalidCNAME('');

    setIsLoading(true);
    try {
      // Since we need to handle Sixer Game's migration
      // and somehow there is an issue when tackling naked domain
      //
      // TODO: we may resume the domain checking one day
      // const resp = await grpcWrapper(checkCustomDomainName, {
      //   serviceName,
      //   domainName: domain,
      //   cname: cnameValue,
      //   envId,
      // });
      // if (!resp.getIscnameok()) {
      //   setInvalidCNAME(resp.getCnamefound());
      //   setExpectedCNAME(resp.getCnamewanted());
      // } else {

      // }
      await grpcWrapper(createCustomDomainName, {
        serviceName,
        domainName: domain,
        cname: cnameValue,
        envId,
      });
      // insert the newly added domain to redux state
      dispatch(insertDomain(domain));
      dispatch(doHidePanel());
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const hasError = invalidCNAME !== expectedCNAME || errorMessage !== '';
  return (
    <StyledDiv>
      <AppBar color="transparent" position="static" elevation={1}>
        <SidePanelTitleBar title={domain} />
      </AppBar>
      <Container>
        <Typography variant="body2">
          Add the CNAME record below to your DNS provider{' '}
          {!readOnly && 'then click ‘Verify’.'}
        </Typography>
        <VerticalSpacer size={16} />
        <TableContainer component={Paper}>
          <Table aria-label="simple-table">
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="condensed-col">
                  <Typography variant="overline">TYPE</Typography>
                </TableCell>
                <TableCell className="condensed-col">
                  <Typography variant="overline">NAME</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="overline">VALUE</Typography>
                </TableCell>
                <TableCell className="condensed-col" />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">CNAME</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{domain}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{cnameValue}</Typography>
                </TableCell>
                <TableCell>
                  <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Tooltip
                      onClose={() => setOpen(false)}
                      open={open}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={`"${cnameValue}" copied`}
                    >
                      <CopyToClipboard
                        text={cnameValue}
                        onCopy={() => setOpen(true)}
                      >
                        <IconButton
                          aria-label={cnameValue}
                          edge="end"
                          size="small"
                        >
                          <CopyIcon />
                        </IconButton>
                      </CopyToClipboard>
                    </Tooltip>
                  </ClickAwayListener>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <VerticalSpacer size={16} />
        <SeparatedRow>
          {hasError &&
            (errorMessage ? (
              <div className="error-text">
                <ErrorOutlineRounded />
                <Typography variant="overline">{errorMessage}</Typography>
              </div>
            ) : (
              <div className="error-text">
                <ErrorOutlineRounded />
                <Typography variant="overline">
                  Expected CNAME value: "
                </Typography>
                <Typography variant="overline" className="bold">
                  {expectedCNAME}
                </Typography>
                <Typography variant="overline">" but found "</Typography>
                <Typography variant="overline" className="bold">
                  {invalidCNAME}
                </Typography>
                <Typography variant="overline">
                  ". Please ensure your settings are correct. It may take
                  several minutes for your DNS provider to update the record.
                </Typography>
              </div>
            ))}
          {!hasError && <div />}
          {!readOnly && (
            <SolidIconButton
              color="primary"
              variant="contained"
              data-cy="verify-domain-button"
              text={hasError ? 'Refresh' : 'OK'}
              isLoading={isLoading}
              onClick={checkAndCreateDomain}
            />
          )}
        </SeparatedRow>
      </Container>
    </StyledDiv>
  );
};
