// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rtt) */
import { IStackStyles, Theme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import { _pxToRem } from '@internal/acs-ui-common';

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const rttContainerStyles = (theme: Theme): IStackStyles => ({
  root: {
    boxShadow: theme.effects.elevation8,
    width: 'fit-content',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    position: 'relative',
    backgroundColor: theme.palette.white
  }
});