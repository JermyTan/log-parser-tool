import React from "react";
import { CSSTransition } from "react-transition-group";
import styled, { css } from "styled-components";

type MainContainerProps = {
  fullScreen: boolean;
  allowScrollbar: boolean;
  state: any;
};

const MainContainer = styled.div`
  ${({ fullScreen }: MainContainerProps) =>
    fullScreen &&
    css`
      position: fixed;
      display: block;
      z-index: 800;
      height: 100vh;
      width: 100vw;
      top: 0;
      left: 0;
    `};
  ${({ fullScreen, allowScrollbar }: MainContainerProps) =>
    fullScreen &&
    !allowScrollbar &&
    css`
      overflow: hidden;
    `};
  ${({ fullScreen, allowScrollbar }: MainContainerProps) =>
    fullScreen &&
    allowScrollbar &&
    css`
      overflow: auto;
    `};
  ${({ state }: MainContainerProps) =>
    state === "entering" &&
    css`
      opacity: 0;
      transform: scale(0.6);
    `};
  ${({ state }: MainContainerProps) =>
    state === "entered" &&
    css`
      transition: all 400ms cubic-bezier(0.6, -0.6, 0.125, 1.65);
      transform: scale(1);
      border-radius: 0;
      opacity: 1;
    `};
  ${({ state }: MainContainerProps) =>
    state === "exiting" &&
    css`
      transition: all 350ms cubic-bezier(0.6, -0.6, 0.125, 1.65);
      position: fixed;
      overflow: hidden;
      display: block;
      z-index: 800;
      height: 100vh;
      width: 100vw;
      transform: scale(0.8);
      top: 0;
      left: 0;
      opacity: 0;
    `};
  ${({ state }: MainContainerProps) =>
    state === "exited" &&
    css`
      transition: opacity 150ms linear;
    `};
`;

type FullscreenProps = {
  children: any;
  fullScreen: boolean;
  allowScrollbar: boolean;
};

function Fullscreen({ fullScreen, children, allowScrollbar }: FullscreenProps) {
  return (
    <CSSTransition
      in={fullScreen}
      appear
      classNames="_fullscreen-transition"
      timeout={fullScreen ? 50 : 350}
    >
      {(state) => (
        <MainContainer
          fullScreen={fullScreen}
          allowScrollbar={allowScrollbar}
          state={state}
        >
          {children}
        </MainContainer>
      )}
    </CSSTransition>
  );
}

export default Fullscreen;
