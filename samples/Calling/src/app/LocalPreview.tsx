// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import React from 'react';
import {
  CameraButton,
  ControlBar,
  ErrorBar as ErrorBarComponent,
  MicrophoneButton,
  StreamMedia,
  VideoTile
} from 'react-components';
import { connectFuncsToContext, MapToErrorBarProps } from 'react-composites';
import { useSelector } from './hooks/useSelector';
import { usePropsFor } from './hooks/usePropsFor';
import { localPreviewSelector } from '@azure/acs-calling-selector';

export const LocalPreview = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const localPreviewProps = useSelector(localPreviewSelector);

  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        videoProvider={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        placeholderProvider={
          <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
            <Stack.Item align="center">
              <CallVideoOffIcon />
            </Stack.Item>
            <Stack.Item align="center">
              <Text className={cameraOffLabelStyle}>Your camera is turned off</Text>
            </Stack.Item>
          </Stack>
        }
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} />
          <MicrophoneButton {...microphoneButtonProps} />
        </ControlBar>
      </VideoTile>
      <ErrorBar />
    </Stack>
  );
};
