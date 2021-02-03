import React from 'react';
import styled from 'styled-components';
import { bps } from 'theme';
import LandingPageBG from 'assets/images/onboarding-bg.svg';
import LandingBackdrop from 'components/atoms/LandingBackdrop';


const StyledDiv = styled.div`
  display: flex;  
  height: 100vh;
  .main {
    width: 60%;
    ${bps.down('sm')} {
      width: 100%;
    }
  }
  .right {
    .logo-icon{
      position: absolute;
      right: 0px;
      padding: 16px 32px;
      width: 50px;
      height: 50px;
    }

    width: 40%;
    height: 100%;
    background-color: #000A12;
    background-image: url("${LandingPageBG}");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    ${bps.down('sm')} {
      width: 0%;
      display: none;
    }
  }
`;

const DefaultLayout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <StyledDiv>
      <div className="main">{children}</div>
      <LandingBackdrop />
    </StyledDiv>
  );
};

export default DefaultLayout;
