import React from 'react';
import { trackError } from 'libraries/helpers';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { PATH_MAINTENANCE } from 'libraries/constants';

interface ErrorState {
  hasError?: boolean;
}
// ComponentDidCatch not avaliable yet on react hook, so we use the old way
class ErrorBoundaries extends React.Component<
  React.ComponentProps<'div'> & MapDispatchToProps,
  ErrorState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: {}) {
    trackError('ERROR_BOUNDARY', error);
  }

  // eslint-disable-next-line class-methods-use-this
  refreshPage() {
    window.location.reload();
  }

  render() {
    const { goToMaintenance } = this.props;

    if (this.state.hasError) {
      // You can render any custom fallback UI

      goToMaintenance();
      return <></>;
    }

    return <>{this.props.children}</>;
  }
}

interface MapDispatchToProps {
  goToMaintenance: () => void;
}

const mapDispatchToProps = (dispatch: Function): MapDispatchToProps => {
  return {
    goToMaintenance: () => {
      dispatch(push(PATH_MAINTENANCE));
    },
  };
};

export default connect<{}, MapDispatchToProps>(
  null,
  mapDispatchToProps
)(ErrorBoundaries);
