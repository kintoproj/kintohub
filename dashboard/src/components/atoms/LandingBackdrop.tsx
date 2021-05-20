import React from 'react';
import styled from 'styled-components';
import { bps } from 'theme';
import LandingPageBG from 'assets/images/onboarding-bg.svg';
import KintoLogoSVG from 'assets/images/logo-full-color.svg';

const StyledDiv = styled.div`
  z-index: 1;
  .logo-icon{
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 16px 32px;
    width: 50px;
    height: 50px;
  }

  .right-content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  width: 40%;
  height: 100%;
  background-color: #000A12;
  background-image: url("${LandingPageBG}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  ${bps.down('sm')} {
    width: 0%;
    display: none;
  }
`;

export default ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <StyledDiv>
      <div className="right-content">{children}</div>

      <img className="logo-icon" src={KintoLogoSVG} alt="logo" />
    </StyledDiv>
  );
};
