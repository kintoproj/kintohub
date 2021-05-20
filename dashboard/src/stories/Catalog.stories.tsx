import React from 'react';
import { action } from '@storybook/addon-actions';
import StatusText from '../components/atoms/StatusText';
import StatusIcon from '../components/atoms/StatusIcon';

export default {
  title: 'Atoms',
};

export const SuccessText = () => <StatusText status="success" text="success" />;

export const InfoText = () => <StatusText status="error" text="error" />;

export const ErrorText = () => <StatusText status="info" text="info" />;

export const WarningText = () => <StatusText status="warning" text="warning" />;

export const AnimatedStatus = () => (
  <StatusIcon color="error" animated={true} />
);
