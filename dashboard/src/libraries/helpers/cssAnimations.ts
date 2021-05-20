export const getSlidingAnimation = (mainClassName: string): string => `  
  .${mainClassName}-enter {
    transform: translate(100%, 0);
  }

  .${mainClassName}-enter.${mainClassName}-enter-active {
    transform: translate(0, 0);
    transition: transform 300ms ease-in;
  }

  .${mainClassName}-exit{
    transform: translate(0, 0);
  }

  .${mainClassName}-exit-done {
    transform: translate(-100, 0);
  }

  .${mainClassName}-exit {
    transform: translate(-200%, 0);
    transition: transform 300ms ease-in;
  }
`;

export const getSlidingAnimationBackward = (
  mainClassName: string
): string => `  
  .${mainClassName}-enter {
    transform: translate(-100%, 0);
  }

  .${mainClassName}-enter.${mainClassName}-enter-active {
    transform: translate(0, 0);
    transition: transform 300ms ease-in;
  }

  .${mainClassName}-exit{
    transform: translate(0, 0);
  }

  .${mainClassName}-exit-done {
    transform: translate(100%, 0);
  }

  .${mainClassName}-exit {
    transform: translate(200%, 0);
    transition: transform 300ms ease-in;
  }
`;
