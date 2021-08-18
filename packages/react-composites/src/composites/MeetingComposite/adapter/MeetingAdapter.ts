// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
  CallAdapterHandlers,
  CallIdChangedListener,
  DisplayNameChangedListener,
  IsMuteChangedListener,
  IsScreenSharingOnChangedListener,
  IsSpeakingChangedListener,
  ParticipantJoinedListener,
  ParticipantLeftListener
} from '../../CallComposite';
import {
  ChatAdapterHandlers,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener
} from '../../ChatComposite';
import { MeetingState } from '../state/MeetingState';

import type { AdapterState, AdapterDisposal } from '../../common/adapters';

export type MeetingCompositePage = 'configuration' | 'meeting' | 'error' | 'errorJoiningTeamsMeeting' | 'removed';

export interface MeetingAdapterHandlers {
  removeParticipant(userId: string): Promise<void>;
}

export interface MeetingAdapterSubscriptions {
  // Meeting specific subscriptions
  on(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  on(event: 'meetingEnded', listener: ParticipantLeftListener): void;
  on(event: 'error', listener: (e: Error) => void): void;

  off(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  off(event: 'meetingEnded', listener: ParticipantLeftListener): void;
  off(event: 'error', listener: (e: Error) => void): void;

  // Call subscriptions
  on(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;

  off(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;

  // Chat subscriptions
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
}

export interface MeetingAdapter
  extends AdapterState<MeetingState>,
    AdapterDisposal,
    AdapterPages<MeetingCompositePage>,
    MeetingAdapterHandlers,
    Pick<
      CallAdapterHandlers,
      | 'joinCall'
      | 'leaveCall'
      | 'setCamera'
      | 'setMicrophone'
      | 'setSpeaker'
      | 'askDevicePermission'
      | 'queryCameras'
      | 'queryMicrophones'
      | 'querySpeakers'
      | 'startCamera'
      | 'stopCamera'
      | 'onToggleCamera'
      | 'mute'
      | 'unmute'
      | 'startCall'
      | 'startScreenShare'
      | 'stopScreenShare'
      | 'createStreamView'
      | 'disposeStreamView'
    >,
    Pick<
      ChatAdapterHandlers,
      'fetchInitialData' | 'sendMessage' | 'sendReadReceipt' | 'sendTypingIndicator' | 'loadPreviousChatMessages'
    >,
    MeetingAdapterSubscriptions {}

export type MeetingEvent =
  | 'meetingEnded'
  | 'participantsJoined'
  | 'participantsLeft'
  | 'isMutedChanged'
  | 'callIdChanged'
  | 'isLocalScreenSharingActiveChanged'
  | 'displayNameChanged'
  | 'isSpeakingChanged'
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'error';
