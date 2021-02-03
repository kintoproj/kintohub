import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from 'states/types';

import { SidePanelActionDataTypes } from './types';

export const ACTION_SHOW_PANEL = 'SHOW_PANEL';
export const ACTION_SET_NEXT_PANEL = 'SET_NEXT_PANEL';
export const ACTION_HIDE_PANEL = 'HIDE_PANEL';
export const ACTION_SET_FORM_MODIFIED = 'SIDEPANEL_FORM_MODIFIED';
export const ACTION_SET_DISCARD_ALERT_SHOWN = 'DISCARD_ALERT_SHOWN';

export interface ShowPanelAction {
  type: typeof ACTION_SHOW_PANEL;
  data: SidePanelActionDataTypes;
}

export interface SetNextPanelAction {
  type: typeof ACTION_SET_NEXT_PANEL;
  nextData: SidePanelActionDataTypes;
}

interface HidePanelAction {
  type: typeof ACTION_HIDE_PANEL;
}

interface SetFormModifiedAction {
  type: typeof ACTION_SET_FORM_MODIFIED;
  isModified: boolean;
}

interface ShowDiscardAlertAction {
  type: typeof ACTION_SET_DISCARD_ALERT_SHOWN;
  shouldShow: boolean;
}

export const showPanel = (data: SidePanelActionDataTypes) => ({
  type: ACTION_SHOW_PANEL,
  data,
});

export const setFormModified = (modified: boolean) => ({
  type: ACTION_SET_FORM_MODIFIED,
  isModified: modified,
});

export const setDiscardAlertShown = (shouldShow: boolean) => ({
  type: ACTION_SET_DISCARD_ALERT_SHOWN,
  shouldShow,
});

interface HidePanelProps {
  confirm?: boolean;
  nextPanel?: SidePanelActionDataTypes;
}

/**
 * Hide the panel. If the form within the panel is modified, it will popup an alert to confirm instead
 * @see setFormModified
 * @param {
 *  confirm:  confirm to close the panel. will hide the panel instead of showing the alert
 *  nextPanel: if defined, when the panel is closed, it will pop the next one after 300ms
 * }
 */
// eslint-disable-next-line max-len
export const doHidePanel = ({
  confirm,
  nextPanel,
}: HidePanelProps = {}): ThunkAction<
  Promise<void>,
  RootState,
  {},
  AnyAction
> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {
  const { isFormModified, nextData } = getState().sidePanel;
  let shouldHidePanel = false;
  if (isFormModified && !confirm) {
    dispatch({
      type: ACTION_SET_DISCARD_ALERT_SHOWN,
      shouldShow: true,
    });
    if (nextPanel) {
      dispatch({
        type: ACTION_SET_NEXT_PANEL,
        nextData: nextPanel,
      });
    }
  } else if (isFormModified && confirm) {
    dispatch({
      type: ACTION_SET_DISCARD_ALERT_SHOWN,
      shouldShow: false,
    });
    shouldHidePanel = true;
  } else {
    shouldHidePanel = true;
  }

  if (shouldHidePanel) {
    dispatch({
      type: ACTION_HIDE_PANEL,
    });
    if (nextData) {
      setTimeout(() => {
        dispatch({
          type: ACTION_SHOW_PANEL,
          data: nextData,
        });
      }, 300);
    }
  }
};

export type PanelActionTypes =
  | ShowPanelAction
  | HidePanelAction
  | SetNextPanelAction
  | SetFormModifiedAction
  | ShowDiscardAlertAction;
