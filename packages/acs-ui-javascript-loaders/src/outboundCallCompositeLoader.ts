// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  CallCompositeOptions,
  StartCallIdentifier,
  AzureCommunicationCallAdapterOptions,
  CallAdapter
} from '@internal/react-composites';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the OutboundCallComposite that you can use in your application.
 *
 * Contains two options bags:
 * - adapterOptions: Options for the {@link AzureCommunicationCallAdapter}
 * - callCompositeOptions: Options for the {@link CallComposite} {@link CallCompositeOptions}
 *
 * @public
 */
export type OutboundCallCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName: string;
  targetCallees: string[] | StartCallIdentifier[];
  adapterOptions?: AzureCommunicationCallAdapterOptions;
  callCompositeOptions?: CallCompositeOptions;
};

/**
 * Loader function for the OutboundCallComposite that you can use in your application. This
 * function will load the CallComposite into the provided HTML element to make outbound calls.
 * The best use case for this is in a Node UI framework that is not React based.
 *
 * @public
 */
export const loadOutboundCallComposite = async function (
  loaderArgs: OutboundCallCompositeLoaderProps,
  htmlElement: HTMLElement
): Promise<CallAdapter | undefined> {
  initializeIcons();
  const { userId, token, displayName, targetCallees, adapterOptions, callCompositeOptions } = loaderArgs;
  const formattedTargetCallees =
    typeof targetCallees[0] === 'string'
      ? (targetCallees as string[]).map((callee: string) => {
          return fromFlatCommunicationIdentifier(callee);
        })
      : undefined;

  const adapter = await createAzureCommunicationCallAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    targetCallees: (formattedTargetCallees as StartCallIdentifier[]) ?? (targetCallees as StartCallIdentifier[]),
    options: adapterOptions
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComposite, { options: callCompositeOptions, adapter }, null));
  return adapter;
};
