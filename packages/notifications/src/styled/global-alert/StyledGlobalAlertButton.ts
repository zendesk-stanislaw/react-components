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
  focusStyles
} from '@zendeskgarden/react-theming';
import { Button } from '@zendeskgarden/react-buttons';

import { IGlobalAlertProps } from '../../types';
import { colorStyles as basicColorStyles } from './StyledGlobalAlertClose';

const COMPONENT_ID = 'notifications.global-alert.button';

interface IStyledGlobalAlertButtonProps {
  alertType: IGlobalAlertProps['type'];
  isBasic?: boolean;
}

function colorStyles(props: ThemeProps<DefaultTheme> & IStyledGlobalAlertButtonProps) {
  if (props.isBasic) {
    return basicColorStyles(props);
  }

  let backgroundColor;
  let hoverBackgroundColor;
  let activeBackgroundColor;
  let focusColor;

  switch (props.alertType) {
    case 'success':
      backgroundColor = getColor('successHue', 800, props.theme);
      hoverBackgroundColor = getColor('successHue', 900, props.theme);
      activeBackgroundColor = getColor('successHue', 1000, props.theme);
      focusColor = 'successHue';
      break;

    case 'error':
      backgroundColor = getColor('dangerHue', 800, props.theme);
      hoverBackgroundColor = getColor('dangerHue', 900, props.theme);
      activeBackgroundColor = getColor('dangerHue', 1000, props.theme);
      focusColor = 'dangerHue';
      break;

    case 'warning':
      backgroundColor = getColor('warningHue', 800, props.theme);
      hoverBackgroundColor = getColor('warningHue', 900, props.theme);
      activeBackgroundColor = getColor('warningHue', 1000, props.theme);
      focusColor = 'warningHue';
      break;

    case 'info':
      focusColor = 'primaryHue';
      break;
  }

  return css`
    background-color: ${backgroundColor};

    &:hover {
      background-color: ${hoverBackgroundColor};
    }

    ${focusStyles({
      theme: props.theme,
      hue: focusColor,
      shade: props.alertType === 'info' ? 600 : 800
    })}

    &:active {
      background-color: ${activeBackgroundColor};
    }
  `;
}

function sizeStyles(props: ThemeProps<DefaultTheme>) {
  // Vertically center 32px button while retaining line height
  const marginVertical = `-${props.theme.space.base * 1.5}px`;
  const marginStart = `${props.theme.space.base * 2}px`;

  return css`
    margin: ${marginVertical} ${props.theme.rtl ? marginStart : 0} ${marginVertical}
      ${props.theme.rtl ? 0 : marginStart};
  `;
}

export const StyledGlobalAlertButton = styled(Button).attrs({
  'data-garden-id': COMPONENT_ID,
  'data-garden-version': PACKAGE_VERSION,
  focusInset: false,
  isDanger: false,
  isLink: false,
  isNeutral: false,
  isPill: false,
  isStretched: false,
  size: 'small'
})`
  flex-shrink: 0;

  ${sizeStyles};
  ${colorStyles};

  ${props => retrieveComponentStyles(COMPONENT_ID, props)};
`;

StyledGlobalAlertButton.defaultProps = {
  theme: DEFAULT_THEME
};
