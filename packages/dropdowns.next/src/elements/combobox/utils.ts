/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { Children, ReactNode, isValidElement } from 'react';
import { IOption, IUseComboboxProps } from '@zendeskgarden/container-combobox';
import { IOptGroupProps, IOptionProps } from '../../types';

/**
 * Convert an option object to a string.
 *
 * @param option An option of type `IOption`.
 *
 * @returns A string based on `option.value`.
 */
export const toString = (option: IOption) =>
  typeof option.value === 'string' ? option.value : JSON.stringify(option.value);

/**
 * Convert `Option` props to a valid object for `useCombobox`.
 *
 * @param props `Option` props.
 *
 * @returns A valid `IOption` object.
 */
export const toOption = (props: IOptionProps): IOption => {
  return {
    value: props.value,
    label: props.label,
    disabled: props.isDisabled,
    selected: props.isSelected
  };
};

/**
 * Convert an array of `Option` and `OptGroup` children to a valid `options`
 * data structure for `useCombobox` (collect `tagProps` along the way).
 *
 * @param children The `children` prop from `Combobox`.
 * @param optionTagProps A collection that maps option values to tag props.
 *
 * @returns A valid `IUseComboboxProps['options']` data structure.
 */
export const toOptions = (
  children: ReactNode,
  optionTagProps: Record<string, IOptionProps['tagProps']>
) =>
  Children.toArray(children).reduce((options: IUseComboboxProps['options'], option) => {
    const retVal = options;

    if (isValidElement(option)) {
      if ('value' in option.props) {
        retVal.push(toOption(option.props));
        optionTagProps[toString(option.props)] = option.props.tagProps;
      } else {
        const props: IOptGroupProps = option.props;
        const groupOptions = toOptions(props.children, optionTagProps) as IOption[];

        retVal.push({ label: props.label, options: groupOptions });
      }
    }

    return retVal;
  }, []);
