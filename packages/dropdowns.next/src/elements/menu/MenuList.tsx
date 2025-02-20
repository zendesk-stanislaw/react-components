/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import { DEFAULT_THEME } from '@zendeskgarden/react-theming';
import {
  getFallbackPlacements,
  toArrowPosition,
  toFloatingPlacement,
  toMenuPosition
} from './utils';
import { Placement, autoUpdate, flip, offset, size, useFloating } from '@floating-ui/react-dom';
import { IMenuListProps, PLACEMENT } from '../../types';
import { StyledFloatingMenu, StyledMenu } from '../../views';
import { createPortal } from 'react-dom';

/**
 * @extends HTMLAttributes<HTMLUListElement>
 */
export const MenuList = forwardRef<HTMLUListElement, IMenuListProps>(
  (
    {
      appendToNode,
      hasArrow,
      isCompact,
      isExpanded,
      fallbackPlacements: _fallbackPlacements,
      maxHeight,
      minHeight,
      placement: _placement,
      triggerRef,
      zIndex,
      children,
      ...props
    },
    ref
  ) => {
    const floatingRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(isExpanded);
    const [height, setHeight] = useState<number>();
    /* istanbul ignore next */
    const theme = useContext(ThemeContext) || DEFAULT_THEME;
    const floatingPlacement = toFloatingPlacement(theme.rtl, _placement!);
    const fallbackPlacements = useMemo(
      () => getFallbackPlacements(theme.rtl, floatingPlacement, _fallbackPlacements),
      [floatingPlacement, _fallbackPlacements, theme.rtl]
    );

    const {
      refs,
      placement,
      update,
      floatingStyles: { transform }
    } = useFloating<HTMLElement>({
      elements: { reference: triggerRef?.current, floating: floatingRef?.current },
      placement: floatingPlacement as Placement,
      middleware: [
        offset(theme.space.base * (hasArrow ? 2 : 1)),
        flip({ fallbackPlacements }),
        size({
          apply: ({ rects, availableHeight }) => {
            /* istanbul ignore if */
            if (!(minHeight === null || minHeight === 'fit-content')) {
              if (rects.floating.height > availableHeight) {
                setHeight(availableHeight);
              }
            }
          }
        })
      ]
    });

    useEffect(() => {
      // Only allow positioning updates on expanded menu.
      let cleanup: () => void;

      if (isExpanded && refs.reference.current && refs.floating.current) {
        cleanup = autoUpdate(refs.reference.current, refs.floating.current, update, {
          elementResize: typeof ResizeObserver === 'function'
        });
      }

      return () => cleanup && cleanup();
    }, [isExpanded, refs.reference, refs.floating, update]);

    useEffect(() => {
      let timeout: NodeJS.Timeout;

      /* istanbul ignore else */
      if (isExpanded) {
        setIsVisible(true);
      } else {
        timeout = setTimeout(() => {
          setIsVisible(false);
          setHeight(undefined);
        }, 200 /* match menu opacity transition */);
      }

      return () => clearTimeout(timeout);
    }, [isExpanded]);

    useEffect(
      () => {
        /* istanbul ignore if */
        if (height) {
          // Reset height on options change.
          setHeight(undefined);
          update();
        }
      },
      /* eslint-disable-line react-hooks/exhaustive-deps */ [
        /* height, // prevent height update loop */
        children,
        update
      ]
    );

    const Node = (
      <StyledFloatingMenu
        data-garden-animate={isVisible}
        isHidden={!isExpanded}
        position={toMenuPosition(placement)}
        zIndex={zIndex}
        style={{ transform }}
        ref={floatingRef}
      >
        <StyledMenu
          data-garden-animate-arrow={isVisible}
          arrowPosition={hasArrow ? toArrowPosition(placement) : undefined}
          isCompact={isCompact}
          minHeight={minHeight}
          maxHeight={maxHeight}
          style={{ height }}
          {...props}
          ref={ref}
        >
          {isVisible && children}
        </StyledMenu>
      </StyledFloatingMenu>
    );

    return appendToNode ? createPortal(Node, appendToNode) : Node;
  }
);

MenuList.displayName = 'MenuList';

MenuList.propTypes = {
  appendToNode: PropTypes.any,
  hasArrow: PropTypes.bool,
  isCompact: PropTypes.bool,
  isExpanded: PropTypes.bool,
  maxHeight: PropTypes.string,
  minHeight: PropTypes.string,
  placement: PropTypes.oneOf(PLACEMENT),
  triggerRef: PropTypes.any,
  zIndex: PropTypes.number
};

MenuList.defaultProps = {
  maxHeight: '400px',
  placement: 'bottom-start',
  zIndex: 1000
};
