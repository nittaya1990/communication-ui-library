// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, mergeStyles, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useMemo, useState } from 'react';
import { useTheme } from '../../theming';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
/* @conditional-compile-remove(vertical-gallery) */
import { isShortHeight } from '../utils/responsive';
import { FloatingLocalVideo } from './FloatingLocalVideo';
import { LayoutProps } from './Layout';
import {
  LARGE_FLOATING_MODAL_SIZE_REM,
  localVideoTileContainerStyle,
  localVideoTileWithControlsContainerStyle,
  LOCAL_VIDEO_TILE_ZINDEX,
  SMALL_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
/* @conditional-compile-remove(vertical-gallery) */
import {
  SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM,
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
import { innerLayoutStyle, layerHostStyle, rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { OverflowGallery } from './OverflowGallery';

/**
 * Props for {@link FloatingLocalVideoLayout}.
 *
 * @private
 */
export interface FloatingLocalVideoLayoutProps extends LayoutProps {
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Height of parent element
   */
  parentHeight?: number;
}

/**
 * FloatingLocalVideoLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const FloatingLocalVideoLayout = (props: FloatingLocalVideoLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    showCameraSwitcherInLocalPreview,
    parentWidth,
    parentHeight,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout = 'HorizontalBottom'
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  /* @conditional-compile-remove(vertical-gallery) */
  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  const { gridParticipants, horizontalGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds
  });

  let activeVideoStreams = 0;

  const gridTiles = gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const shouldFloatLocalVideo = remoteParticipants.length > 0 || !!screenShareComponent;

  if (!shouldFloatLocalVideo && localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  /**
   * instantiate indexes available to render with indexes available that would be on first page
   *
   * For some components which do not strictly follow the order of the array, we might
   * re-render the initial tiles -> dispose them -> create new tiles, we need to take care of
   * this case when those components are here
   */
  const [indexesToRender, setIndexesToRender] = useState<number[]>([
    ...Array(maxRemoteVideoStreams - activeVideoStreams).keys()
  ]);

  const horizontalGalleryTiles = horizontalGalleryParticipants.map((p, i) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && indexesToRender.includes(i) && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const layerHostId = useId('layerhost');

  const localVideoSizeRem = useMemo(() => {
    if (isNarrow) {
      return SMALL_FLOATING_MODAL_SIZE_REM;
    }
    /* @conditional-compile-remove(vertical-gallery) */
    if ((horizontalGalleryTiles.length > 0 || !!screenShareComponent) && overflowGalleryLayout === 'VerticalRight') {
      return isNarrow
        ? SMALL_FLOATING_MODAL_SIZE_REM
        : isShort
        ? SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
        : VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM;
    }
    return LARGE_FLOATING_MODAL_SIZE_REM;
  }, [
    horizontalGalleryTiles.length,
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout,
    /* @conditional-compile-remove(vertical-gallery) */ screenShareComponent
  ]);

  const wrappedLocalVideoComponent =
    localVideoComponent && shouldFloatLocalVideo ? (
      // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
      showCameraSwitcherInLocalPreview ? (
        <Stack
          className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, localVideoSizeRem), {
            boxShadow: theme.effects.elevation8,
            zIndex: LOCAL_VIDEO_TILE_ZINDEX
          })}
        >
          {localVideoComponent}
        </Stack>
      ) : horizontalGalleryTiles.length > 0 || !!screenShareComponent ? (
        <Stack className={mergeStyles(localVideoTileContainerStyle(theme, localVideoSizeRem))}>
          {localVideoComponent}
        </Stack>
      ) : (
        <FloatingLocalVideo
          localVideoComponent={localVideoComponent}
          layerHostId={layerHostId}
          localVideoSizeRem={localVideoSizeRem}
          parentWidth={parentWidth}
          parentHeight={parentHeight}
        />
      )
    ) : undefined;

  const overflowGallery = useMemo(() => {
    if (horizontalGalleryTiles.length === 0 && !screenShareComponent) {
      return null;
    }
    return (
      <OverflowGallery
        /* @conditional-compile-remove(vertical-gallery) */
        isShort={isShort}
        onFetchTilesToRender={setIndexesToRender}
        isNarrow={isNarrow}
        shouldFloatLocalVideo={true}
        overflowGalleryElements={horizontalGalleryTiles}
        horizontalGalleryStyles={styles?.horizontalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        veritcalGalleryStyles={styles?.verticalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryLayout={overflowGalleryLayout}
      />
    );
  }, [
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    horizontalGalleryTiles,
    styles?.horizontalGallery,
    setIndexesToRender,
    screenShareComponent,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout,
    /* @conditional-compile-remove(vertical-gallery) */ styles?.verticalGallery
  ]);

  return (
    <Stack styles={rootLayoutStyle}>
      {wrappedLocalVideoComponent}
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <Stack
        /* @conditional-compile-remove(vertical-gallery) */
        horizontal={overflowGalleryLayout === 'VerticalRight'}
        styles={innerLayoutStyle}
        tokens={videoGalleryLayoutGap}
      >
        {screenShareComponent ? (
          screenShareComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {overflowGallery}
      </Stack>
    </Stack>
  );
};
