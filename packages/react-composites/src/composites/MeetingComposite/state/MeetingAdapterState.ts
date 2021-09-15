// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier } from '@azure/communication-common';
import { CallAdapter, CallAdapterClientState, CallAdapterState } from '../../CallComposite';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { callPageToMeetingPage, MeetingCompositePage } from './MeetingCompositePage';
import {
  generateMeetingState,
  MeetingState,
  mergeCallStateIntoMeetingState,
  mergeChatStateIntoMeetingState
} from './MeetingState';

/**
 * UI state pertaining to the Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterUiState {
  /** Current page in the meeting composite. */
  page: MeetingCompositePage;
}

/**
 * State from the backend services that drives Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterClientState extends Pick<CallAdapterClientState, 'devices'> {
  /** ID of the meeting participant using this Meeting Adapter. */
  userId: CommunicationIdentifier;
  /** Display name of the meeting participant using this Meeting Adapter. */
  displayName: string | undefined;
  /** State of the current Meeting. */
  meeting: MeetingState | undefined;
}

/**
 * Meeting State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to meetings only.
 * Stateful items like Participants that apply to both calling and chat are intelligently
 * combined into one to suit the purpose of a Meeting.
 *
 * @alpha
 */
export interface MeetingAdapterState extends MeetingAdapterUiState, MeetingAdapterClientState {}

export function generateMeetingAdapterState(callAdapter: CallAdapter, chatAdapter: ChatAdapter): MeetingAdapterState {
  const callAdapterState = callAdapter.getState();
  const chatAdapterState = chatAdapter.getState();

  const meeting = callAdapterState.call
    ? generateMeetingState(callAdapterState.call, chatAdapterState.thread)
    : undefined;

  return {
    meeting,
    userId: callAdapterState.userId,
    page: callPageToMeetingPage(callAdapterState.page),
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices
  };
}

export function mergeChatAdapterStateIntoMeetingAdapterState(
  chatAdapterState: ChatAdapterState,
  meetingAdapterState: MeetingAdapterState
): MeetingAdapterState {
  const newMeetingState = meetingAdapterState.meeting
    ? mergeChatStateIntoMeetingState(chatAdapterState.thread, meetingAdapterState.meeting)
    : undefined;

  return {
    ...meetingAdapterState,
    meeting: newMeetingState
  };
}

export function mergeCallAdapterStateIntoMeetingAdapterState(
  callAdapterState: CallAdapterState,
  meetingAdapterState: MeetingAdapterState
): MeetingAdapterState {
  const newMeetingState =
    meetingAdapterState.meeting && callAdapterState.call
      ? mergeCallStateIntoMeetingState(callAdapterState.call, meetingAdapterState.meeting)
      : undefined;

  return {
    userId: callAdapterState.userId,
    page: callPageToMeetingPage(callAdapterState.page),
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    meeting: newMeetingState
  };
}
