/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import styled, { css, ThemeProps, DefaultTheme } from 'styled-components';
import {
  getColor,
  DEFAULT_THEME,
  retrieveComponentStyles,
  getLineHeight,
  focusStyles
} from '@zendeskgarden/react-theming';

import { IGlobalAlertProps } from '../../types';

const COMPONENT_ID = 'notifications.global-alert';

interface IStyledGlobalAlertProps {
  alertType: IGlobalAlertProps['type'];
}

/**
 * 1. Shifting :focus-visible from LVHFA order to preserve `color` on hover
 */
const colorStyles = (props: ThemeProps<DefaultTheme> & IStyledGlobalAlertProps) => {
  let borderColor;
  let backgroundColor;
  let foregroundColor;
  let anchorHoverColor;
  let anchorActiveColor;
  let focusColor;

  switch (props.alertType) {
    case 'success':
      borderColor = getColor('successHue', 700, props.theme);
      backgroundColor = getColor('successHue', 600, props.theme);
      foregroundColor = getColor('successHue', 100, props.theme);
      anchorHoverColor = props.theme.palette.white;
      anchorActiveColor = props.theme.palette.white;
      focusColor = 'successHue';
      break;

    case 'error':
      borderColor = getColor('dangerHue', 700, props.theme);
      backgroundColor = getColor('dangerHue', 600, props.theme);
      foregroundColor = getColor('dangerHue', 100, props.theme);
      anchorHoverColor = props.theme.palette.white;
      anchorActiveColor = props.theme.palette.white;
      focusColor = 'dangerHue';
      break;

    case 'warning':
      borderColor = getColor('warningHue', 400, props.theme);
      backgroundColor = getColor('warningHue', 300, props.theme);
      foregroundColor = getColor('warningHue', 800, props.theme);
      anchorHoverColor = getColor('warningHue', 900, props.theme);
      anchorActiveColor = getColor('warningHue', 1000, props.theme);
      focusColor = 'warningHue';
      break;

    case 'info':
      borderColor = getColor('primaryHue', 300, props.theme);
      backgroundColor = getColor('primaryHue', 200, props.theme);
      foregroundColor = getColor('primaryHue', 700, props.theme);
      anchorHoverColor = getColor('primaryHue', 800, props.theme);
      anchorActiveColor = getColor('primaryHue', 900, props.theme);
      focusColor = 'primaryHue';
      break;
  }

  // Apply a border without affecting the element's size
  const boxShadow = `0 ${props.theme.borderWidths.sm} ${props.theme.borderWidths.sm} ${borderColor}`;

  /* stylelint-disable selector-no-qualifying-type */
  return css`
    box-shadow: ${boxShadow};
    background-color: ${backgroundColor};
    color: ${foregroundColor};

    & a {
      color: inherit;

      /* [1] */
      ${focusStyles({
        theme: props.theme,
        hue: focusColor,
        shade: props.alertType === 'info' ? 600 : 800,
        styles: { color: 'inherit' }
      })}

      /* [1] */
      &:hover {
        color: ${anchorHoverColor};
      }

      &:active {
        color: ${anchorActiveColor};
      }
    }
  `;
};

const sizeStyles = (props: ThemeProps<DefaultTheme>) => {
  const { fontSizes, space } = props.theme;
  const minHeight = space.base * 13;
  const padding = space.base * 4;
  const lineHeight = getLineHeight(space.base * 5, fontSizes.md);

  return css`
    padding: ${padding}px;
    min-height: ${minHeight}px;
    line-height: ${lineHeight};
    font-size: ${fontSizes.md};
  `;
};

export const StyledGlobalAlert = styled.div.attrs({
  'data-garden-id': COMPONENT_ID,
  'data-garden-version': PACKAGE_VERSION
})`
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  direction: ${props => (props.theme.rtl ? 'rtl' : 'ltr')};

  ${sizeStyles}
  ${colorStyles}

  && a {
    border-radius: ${props => props.theme.borderRadii.sm};
    text-decoration: underline;
  }

  ${props => retrieveComponentStyles(COMPONENT_ID, props)};
`;

StyledGlobalAlert.defaultProps = {
  theme: DEFAULT_THEME
};
