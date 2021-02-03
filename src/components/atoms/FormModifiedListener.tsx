// This class will receive a isDirty prop and fire an action to modify the app state
// This is for triggering the discard dialog box
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFormModified } from 'states/sidePanel/actions';

export type Props = {
  isDirty: boolean;
};

export default ({ isDirty }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFormModified(isDirty));
  }, [isDirty, dispatch]);
  return <></>;
};
