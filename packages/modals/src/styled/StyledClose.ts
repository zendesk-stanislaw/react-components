/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import styled, { css, DefaultTheme, ThemeProps } from 'styled-components';
import {
  getColor,
  retrieveComponentStyles,
  DEFAULT_THEME,
  focusStyles
} from '@zendeskgarden/react-theming';

const COMPONENT_ID = 'modals.close';

const colorStyles = (props: ThemeProps<DefaultTheme>) => {
  const backgroundColor = 'primaryHue';
  const foregroundColor = 'neutralHue';

  return css`
    background-color: transparent;
    color: ${getColor(foregroundColor, 600, props.theme)};

    &:hover {
      background-color: ${getColor(backgroundColor, 600, props.theme, 0.08)};
      color: ${getColor(foregroundColor, 700, props.theme)};
    }

    ${focusStyles({
      theme: props.theme,
      hue: backgroundColor
    })}

    &:active {
      /* prettier-ignore */
      transition:
        background-color 0.1s ease-in-out,
        color 0.1s ease-in-out;
      background-color: ${getColor(backgroundColor, 600, props.theme, 0.2)};
      color: ${getColor(foregroundColor, 800, props.theme)};
    }
  `;
};

export const BASE_MULTIPLIERS = {
  top: 2.5,
  side: 6.5,
  size: 10
};

/**
 * 1. Remove dotted outline from Firefox on focus.
 */
export const StyledClose = styled.button.attrs({
  'data-garden-id': COMPONENT_ID,
  'data-garden-version': PACKAGE_VERSION
})`
  display: block;
  position: absolute;
  top: ${props => props.theme.space.base * BASE_MULTIPLIERS.top}px;
  ${props => (props.theme.rtl ? 'left' : 'right')}: ${props =>
    `${props.theme.space.base * BASE_MULTIPLIERS.side}px`};
  /* prettier-ignore */
  transition:
    box-shadow 0.1s ease-in-out,
    background-color 0.25s ease-in-out,
    color 0.25s ease-in-out;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  width: ${props => props.theme.space.base * BASE_MULTIPLIERS.size}px;
  height: ${props => props.theme.space.base * BASE_MULTIPLIERS.size}px;
  overflow: hidden;
  text-decoration: none;
  font-size: 0;
  user-select: none;

  &::-moz-focus-inner {
    border: 0; /* [1] */
  }

  ${props => colorStyles(props)}

  & > svg {
    vertical-align: middle;
  }

  ${props => retrieveComponentStyles(COMPONENT_ID, props)};
`;

StyledClose.defaultProps = {
  theme: DEFAULT_THEME
};
