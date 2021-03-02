import KintoLogoSVG from 'assets/images/logo-full-color.svg';
import Button from 'components/atoms/Button';
import { AutoExpandSpacer } from 'components/atoms/Spacer';
import {
  useAppState,
  useSidePanelState,
} from 'components/hooks/ReduxStateHook';
import AlertDialog from 'components/molecules/AlertDialog';
import MenuButton from 'components/molecules/MenuButton';
import SidePanel from 'components/organisms/sidePanel';
import { usePopover } from 'components/templates/PopoverHook';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { toggleDarkMode } from 'states/app/actions';
import { doHidePanel, setDiscardAlertShown } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { bps, darkTheme } from 'theme';

import { PopoverOrigin, useMediaQuery } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBackRounded';
import DarkModeIcon from '@material-ui/icons/Brightness2Rounded';
import HelpIcon from '@material-ui/icons/HelpRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';
import BookIcon from '@material-ui/icons/LibraryBooksRounded';
import LightModeIcon from '@material-ui/icons/WbSunnyRounded';
import { useServiceNavigate } from 'components/hooks/PathHook';

const drawerWidth = 72;

const KintoIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const LayoutContainer = styled.div`
  // fix the icon size to prevent notification override it
  .MuiSvgIcon-root {
    font-size: 30px;
  }
  box-sizing: content-box;
  .main {
    box-sizing: border-box;
    height: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.palette.background.default};
    flex-grow: 1;
    width: 100%;
    padding-left: ${drawerWidth}px;
    ${bps.down('xs')} {
      padding-left: 0px;
      padding-bottom: 56px; // height of the bottom nav
    }
    .loading {
      z-index: 9999;
      position: fixed;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .background {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgb(256, 256, 256, 0.4);
      }
    }
  }
  .MuiDrawer-paper {
    ${bps.down('xs')} {
      display: none;
    }
    background-color: ${(props) => props.theme.palette.common.black};
    width: ${drawerWidth}px;
    align-items: center;
    text-transform: uppercase;

    .top-item {
      button {
        color: white;
      }
      min-height: 70px;
    }
  }

  .page-enter {
    opacity: 0;
  }
  .page-enter-active {
    opacity: 1;
    transition: opacity 200ms, transform 200ms;
  }
  .page-exit {
    opacity: 1;
  }
  .page-exit-active {
    opacity: 0;
    transition: opacity 200ms, transform 200ms;
  }
  .list {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .MuiListItem-root {
    padding: 0;
    margin-bottom: 20px;
    text-align: center;
    width: ${drawerWidth}px;
    justify-content: center;
    text-transform: uppercase;
  }

  .MuiListItemIcon-root {
    min-width: 0;
  }

  .help-icon {
    color: rgba(255, 255, 255, 0.5);
  }

  .glow {
    color: white !important;
  }

  .bottom-nav {
    ${bps.up('sm')} {
      display: none;
    }
    z-index: 10;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: ${(props) => props.theme.palette.common.black};
    .menu-button {
      .MuiButton-label {
        display: flex;
        flex-direction: column;
      }
    }
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

const DetachedDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    min-width: 50vw;
    ${bps.down('sm')} {
      width: 100vw;
      min-width: 100vw;
    }
  }
`;

const DefaultLayout = ({ children, ...rest }: React.PropsWithChildren<{}>) => {
  const location = useLocation();
  const pathname = location.pathname || '';
  const isAtServicesPage = pathname.split('/').pop() !== 'services';

  const dispatch = useDispatch();

  const panelState = useSidePanelState();
  const { isLoading, isDarkMode } = useAppState();
  const { navigateToServices } = useServiceNavigate();

  const isMobile = useMediaQuery(bps.down('sm'));

  const anchorOrigin: PopoverOrigin = isMobile
    ? {
        vertical: 'top',
        horizontal: 'center',
      }
    : {
        vertical: 'top',
        horizontal: 'right',
      };

  const transformOrigin: PopoverOrigin = isMobile
    ? {
        vertical: 'bottom',
        horizontal: 'center',
      }
    : {
        vertical: 'center',
        horizontal: -10,
      };

  // Prepare the pop-over for help

  const [helpPopover, openHelpPopover] = usePopover({
    id: 'menu-popover',
    actions: [
      {
        label: 'Slack Support',
        onClick: () => {
          window.open('https://slack.kintohub.com', '_blank');
        },
      },
      {
        label: 'Email Support',
        onClick: () => {
          window.open(
            'mailto:support@kintohub.com?subject=Question%20On%20Kintohub',
            '_blank'
          );
        },
      },
      undefined,
      {
        label: 'Give Feedback',
        onClick: () => {},
        disabled: true,
      },
      {
        label: 'Roadmap',
        onClick: () => {
          window.open('https://feedback.kintohub.com/', '_blank');
        },
      },
      {
        label: 'Report Issue',
        onClick: () => {
          window.open('https://feedback.kintohub.com/bugs', '_blank');
        },
      },
      {
        label: 'Request Feature',
        onClick: () => {
          window.open(
            'https://feedback.kintohub.com/feature-requests',
            '_blank'
          );
        },
      },
    ],
    anchorOrigin,
    transformOrigin,
  });

  // the page transition animation. we use the root route to determine animation key
  // so inside /app/manage/... won't have page transition animation (and component wont remount)
  const transitionKey = pathname.split('/')[2];

  return (
    <LayoutContainer>
      <Drawer variant="permanent">
        <MuiThemeProvider theme={darkTheme}>
          <div className="top-item">
            <MenuButton
              data-cy="home-button"
              tooltip="Home"
              onClick={() => {
                navigateToServices();
              }}
            >
              {isAtServicesPage ? (
                <ArrowBackIcon />
              ) : (
                <KintoIcon src={KintoLogoSVG} alt="kintohub" />
              )}
            </MenuButton>
          </div>
          <div className="list">
            <AutoExpandSpacer />
            <MenuButton
              data-cy="dark-mode-button"
              onClick={() => {
                dispatch(toggleDarkMode(!isDarkMode));
              }}
              tooltip={isDarkMode ? 'Dark Mode' : 'Light Mode'}
            >
              {isDarkMode ? (
                <DarkModeIcon className="help-icon" />
              ) : (
                <LightModeIcon className="help-icon" />
              )}
            </MenuButton>
            <MenuButton
              data-cy="docs-button"
              onClick={() => {
                window.open('https://docs.kintohub.com', '_blank');
              }}
              tooltip="Documentation"
            >
              <BookIcon className="help-icon" />
            </MenuButton>
            <MenuButton
              data-cy="support-button"
              tooltip="Support"
              onClick={(evt) => openHelpPopover(evt)}
            >
              <HelpIcon className="help-icon" />
            </MenuButton>
          </div>
        </MuiThemeProvider>
      </Drawer>
      {helpPopover}
      <div className="bottom-nav">
        <Button
          data-cy="main-page-button"
          className="menu-button"
          onClick={() => {
            navigateToServices();
          }}
        >
          <HomeIcon
            className={`help-icon ${isAtServicesPage ? 'glow' : ''}`}
            fontSize="large"
          />
          <Typography
            variant="overline"
            className={`help-icon ${isAtServicesPage ? 'glow' : ''}`}
          >
            Home
          </Typography>
        </Button>
        <Button
          data-cy="bottom-docs-button"
          className="menu-button"
          onClick={() => {
            window.open('https://docs.kintohub.com', '_blank');
          }}
        >
          <BookIcon className="help-icon" fontSize="large" />
          <Typography variant="overline" className="help-icon">
            Docs
          </Typography>
        </Button>
        <Button
          data-cy="bottom-help-button"
          className="menu-button"
          onClick={(evt) => openHelpPopover(evt)}
        >
          <HelpIcon className="help-icon" fontSize="large" />
          <Typography variant="overline" className="help-icon">
            Support
          </Typography>
        </Button>
      </div>
      <AlertDialog
        title="Discard all changes?"
        text="All the changes will be lost if you leave this page. Press CANCEL if you want to remain on this page."
        isOpen={panelState.isDiscardAlertShown}
        setIsOpen={(open) => {
          dispatch(setDiscardAlertShown(open));
        }}
        onConfirm={() => {
          dispatch(doHidePanel({ confirm: true }));
        }}
      />
      <DetachedDrawer
        data-cy="right-panel"
        anchor="right"
        open={panelState.isActive}
        onClose={() => {
          dispatch(doHidePanel());
        }}
      >
        <SidePanel data={panelState.data} />
      </DetachedDrawer>
      <SwitchTransition>
        <CSSTransition classNames="page" key={transitionKey} timeout={200}>
          <div className="main">
            {isLoading && (
              <div className="loading">
                <div className="background" />
                <CircularProgress />
              </div>
            )}

            {children}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </LayoutContainer>
  );
};

export default DefaultLayout;
