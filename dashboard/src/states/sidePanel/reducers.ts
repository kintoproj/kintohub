import { SidePanelState } from './types';
import {
  ACTION_SHOW_PANEL,
  ACTION_HIDE_PANEL,
  ACTION_SET_FORM_MODIFIED,
  ACTION_SET_DISCARD_ALERT_SHOWN,
  PanelActionTypes,
  ShowPanelAction,
  ACTION_SET_NEXT_PANEL,
} from './actions';

const initialState: SidePanelState = {
  isActive: false,
  isFormModified: false,
  isDiscardAlertShown: false,
  data: null,
  nextData: null,
};

export default function systemReducer(
  state = initialState,
  action: PanelActionTypes
): SidePanelState {
  switch (action.type) {
    case ACTION_SHOW_PANEL: {
      return {
        ...state,
        isActive: true,
        data: (action as ShowPanelAction).data,
        nextData: null,
      };
    }
    case ACTION_SET_DISCARD_ALERT_SHOWN: {
      return {
        ...state,
        isDiscardAlertShown: action.shouldShow,
      };
    }
    case ACTION_SET_FORM_MODIFIED: {
      return {
        ...state,
        isFormModified: action.isModified,
      };
    }
    case ACTION_SET_NEXT_PANEL: {
      return {
        ...state,
        nextData: action.nextData,
      };
    }
    case ACTION_HIDE_PANEL: {
      return {
        ...state,
        isActive: false,
        isFormModified: false,
        isDiscardAlertShown: false,
        data: null,
        nextData: null,
      };
    }
    default:
      return state;
  }
}
