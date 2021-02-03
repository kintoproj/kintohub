import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  removeNotification,
  NotificationActionType,
  NotificationActionDataType,
  Notification,
} from 'states/app/actions';
import Button from 'components/atoms/Button';
import { doHidePanel, showPanel } from 'states/sidePanel/actions';
import { FixItState } from 'types/service';
import { Block } from 'types/proto/kkc_models_pb';
import { useAppState } from 'components/hooks/ReduxStateHook';
import { useServiceNavigate } from 'components/hooks/PathHook';

const Notifier = () => {
  const dispatch = useDispatch();
  const { notifications } = useAppState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { navigateToServiceReleaseLogPage } = useServiceNavigate();

  const notificationsRef = useRef<Notification[]>([]);

  const runActionByType = (
    type: NotificationActionType,
    data: NotificationActionDataType
  ): void => {
    switch (type) {
      case 'FIX_RELEASE_PORT': {
        const s: FixItState = {
          shouldOpenEditPage: true,
          fieldErrors: {
            port: 'Please verify the port is set correctly',
          },
        };
        navigateToServiceReleaseLogPage(data.serviceName, data.releaseId, s);
        dispatch(doHidePanel());

        break;
      }
      case 'FIX_RELEASE': {
        const s: FixItState = {
          shouldOpenEditPage: true,
        };
        navigateToServiceReleaseLogPage(data.serviceName, data.releaseId, s);
        dispatch(doHidePanel());
        break;
      }
      case 'FIX_RELEASE_OOM': {
        const s: FixItState = {
          shouldOpenEditPage: true,
          fieldErrors: {
            memoryIndex: 'Please increase the memory',
          },
        };
        navigateToServiceReleaseLogPage(data.serviceName, data.releaseId, s);
        dispatch(doHidePanel());
        break;
      }
      case 'CHECK_LOGS': {
        const service = Block.deserializeBinary(data.serviceData);
        const release = service.getReleasesMap().get(data.releaseId);

        // there is no way the release is empty
        dispatch(
          showPanel({
            type: 'VIEW_LOGS',
            release: release!,
            service,
          })
        );
        break;
      }
    }
  };

  const findNotificationByKey = (
    key: string,
    values: Notification[]
  ): Notification | null => values.find((notif) => notif.key === key) || null;

  const onNotificationsChanged = (
    next: Notification[],
    current: Notification[]
  ) => {
    const notificationsToShow = [];
    const notificationsToRemove = [];
    for (const notif of next) {
      const currNotif = findNotificationByKey(notif.key, current);
      if (!currNotif) {
        notificationsToShow.push(notif);
      }
    }

    for (const notif of current) {
      if (!findNotificationByKey(notif.key, next)) {
        notificationsToRemove.push(notif);
      }
    }

    notificationsToShow.forEach((n) => showNotification(n));
    notificationsToRemove.forEach((n) => closeSnackbar(n.key));
  };

  const showNotification = ({ option, key, message, type }: Notification) => {
    let action;
    if (option?.actions) {
      action = (k: string) => (
        <>
          {option?.actions?.map((a) => (
            <Button
              data-cy={`notification-action-${a.type}-button`}
              key={a.label}
              onClick={() => {
                runActionByType(a.type, a.data);
                closeSnackbar(k);
              }}
            >
              {a.label}
            </Button>
          ))}
          <Button
            data-cy="notification-close-button"
            onClick={() => {
              closeSnackbar(k);
            }}
          >
            Dismiss
          </Button>
        </>
      );
    }

    // display snackbar using notistack
    enqueueSnackbar(message, {
      key,
      onClose: (event, k: string) => { },
      variant: type,
      persist: option?.persist,
      action,
      onExited: (event, k: string) => {
        dispatch(removeNotification(key));
      },
    });
  };

  React.useEffect(() => {
    onNotificationsChanged(notifications, notificationsRef.current);

    notificationsRef.current = [...notifications];
  }, [notifications]);

  return null;
};

export default Notifier;
