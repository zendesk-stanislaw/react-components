/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import styled, { css, keyframes, DefaultTheme, ThemeProps } from 'styled-components';
import { math } from 'polished';
import {
  retrieveComponentStyles,
  DEFAULT_THEME,
  getColor,
  getLineHeight,
  focusStyles,
  SELECTOR_FOCUS_VISIBLE
} from '@zendeskgarden/react-theming';
import { getHeaderHeight } from './header/StyledHeader';

const COMPONENT_ID = 'chrome.skipnav';

const animationStyles = () => {
  const animationName = keyframes`
    0% {
      transform: translate(-50%, -50%);
    }
  `;

  return css`
    transition:
      opacity 0.2s ease-out,
      clip 0s linear 0.2s;
    opacity: 0;
    clip: rect(0, 0, 0, 0);

    &:focus {
      transition: opacity 0.2s ease-in-out;
      animation: 0.2s cubic-bezier(0.15, 0.85, 0.35, 1.2) ${animationName};
      opacity: 1;
      clip: rect(0, 150vw, 100vh, -50vw);
    }
  `;
};

const colorStyles = (theme: DefaultTheme) => {
  const color = getColor('primaryHue', 600, theme);
  const borderColor = getColor('neutralHue', 300, theme);
  const boxShadow = theme.shadows.lg(
    `${theme.space.base * 5}px`,
    `${theme.space.base * 7}px`,
    getColor('chromeHue', 600, theme, 0.15) as string
  );

  return css`
    border-color: ${borderColor};
    box-shadow: ${boxShadow};
    background-color: ${theme.colors.background};
    color: ${color};

    &:hover,
    &:focus {
      color: ${color};
    }

    ${focusStyles({
      theme,
      inset: true,
      boxShadow
    })}
  `;
};

const sizeStyles = (props: ThemeProps<DefaultTheme>) => {
  const top = math(`${getHeaderHeight(props)} / 2`);
  const padding = `${props.theme.space.base * 5}px`;
  const paddingStart = `${props.theme.space.base * 4}px`;
  const fontSize = props.theme.fontSizes.md;
  const lineHeight = getLineHeight(padding, fontSize);

  return css`
    top: ${top};
    padding: ${padding};
    /* stylelint-disable-next-line property-no-unknown */
    padding-${props.theme.rtl ? 'right' : 'left'}: ${paddingStart};
    line-height: ${lineHeight};
    font-size: ${fontSize};
  `;
};

interface IStyledSkipNavProps {
  zIndex?: number;
}

/**
 * 1. breaking LVHFA order for `<a>` to underline when focused and hovered
 */
export const StyledSkipNav = styled.a.attrs({
  'data-garden-id': COMPONENT_ID,
  'data-garden-version': PACKAGE_VERSION
})<IStyledSkipNavProps>`
  ${animationStyles()};

  display: inline-flex;
  position: absolute;
  left: 50%;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  direction: ${props => props.theme.rtl && 'rtl'};
  z-index: ${props => props.zIndex};
  border: ${props => props.theme.borders.sm};
  border-radius: ${props => props.theme.borderRadii.md};
  text-decoration: underline;
  white-space: nowrap;

  ${props => sizeStyles(props)};

  ${SELECTOR_FOCUS_VISIBLE} {
    text-decoration: none;
  }

  /* [1] */
  &:hover {
    text-decoration: underline;
  }

  ${props => colorStyles(props.theme)};

  ${props => retrieveComponentStyles(COMPONENT_ID, props)};
`;

StyledSkipNav.defaultProps = {
  theme: DEFAULT_THEME
};
