import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ButtonTypography from 'components/atoms/ButtonTypography';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';

type TabData = {
  label: string;
  icon?: string | React.ReactElement;
  disabled?: boolean;
  errors?: number;
};

type Props = {
  tab: number;
  setTab: (tab: number) => void;
  tabs: TabData[];
};

const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    text-transform: none;
    width: ;
  }
  .MuiTabs-root {
    padding: 0 68px;
  }
  .MuiTab-wrapper {
    flex-direction: row;
  }
`;

export default ({ tab, setTab, tabs }: Props) => {
  return (
    <StyledTabs
      value={tab}
      onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
      }}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((t) => (
        <Tab
          data-cy={`tab-${t.label}`}
          key={t.label}
          icon={t.icon}
          label={
            t.errors ? (
              <Badge badgeContent={t.errors} color="error">
                <ButtonTypography>{t.label}</ButtonTypography>
              </Badge>
            ) : (
              <ButtonTypography>{t.label}</ButtonTypography>
            )
          }
          disabled={!!t.disabled}
        />
      ))}
    </StyledTabs>
  );
};
