import React from 'react';
import { action } from '@storybook/addon-actions';
import KBlockTypeButton from 'components/molecules/ServiceTypeButton';
import AccessTimeIcon from '@material-ui/icons/AccessTimeRounded';
import KConnectRepoForm from 'components/organisms/sidePanel/ConnectRepoForm';

export default {
  title: 'Block',
};

export const BlockTypeButton = () => (
  <KBlockTypeButton
    title="Website"
    description="Business-to-consumer user experience iteration learning curve niche market stealth long tail social media."
    icon={AccessTimeIcon}
    onClick={action('clicked')}
  />
);

export const ConnectRepoForm = () => <KConnectRepoForm serviceType={0} />;
