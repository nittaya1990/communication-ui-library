// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, CallClientState, DeviceManagerState, IncomingCallState } from 'calling-stateful-client';
import { CallingBaseSelectorProps } from 'calling-component-bindings';

export const getCalls = (state: CallClientState): { [key: string]: CallState } => state.calls;

export const getCallsEnded = (state: CallClientState): CallState[] => state.callsEnded;

export const getIncomingCalls = (state: CallClientState): { [key: string]: IncomingCallState } => state.incomingCalls;

export const getIncomingCallsEnded = (state: CallClientState): IncomingCallState[] => state.incomingCallsEnded;

export const getDeviceManager = (state: CallClientState): DeviceManagerState => state.deviceManager;

export const getCall = (state: CallClientState, props: CallingBaseSelectorProps): CallState | undefined =>
  state.calls[props.callId];

export const getDisplayName = (state: CallClientState): string | undefined => state.callAgent?.displayName;

export const getIsPreviewCameraOn = (state: CallClientState): boolean => isPreviewOn(state.deviceManager);

// TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also handle
// cases where 'Preview' view is in progress and not necessary completed.
const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};
