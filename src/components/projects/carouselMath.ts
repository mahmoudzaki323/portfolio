const TRANSITION_START = 0.5;
const TRANSITION_END = 0.88;
const PINNED_TRANSITION_START = 0.34;
const PINNED_TRANSITION_END = 0.66;
const PINNED_ENTRY_TOLERANCE = 64;
const PINNED_RELEASE_NUDGE = PINNED_ENTRY_TOLERANCE + 2;
const CAROUSEL_SCROLL_VH_PER_TRANSITION = 82;
const WHEEL_LINE_DELTA_PX = 16;
const HORIZONTAL_WHEEL_SCROLL_MULTIPLIER = 1.35;
const HORIZONTAL_DRAG_SCROLL_MULTIPLIER = 1.8;

type CarouselWheelDelta = {
  ctrlKey?: boolean;
  deltaMode?: number;
  deltaX: number;
  deltaY: number;
  shiftKey?: boolean;
};

export function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function getStagedSlideProgress(progress: number, slideCount: number) {
  if (slideCount <= 1) return 0;

  const maxIndex = slideCount - 1;
  const scaledProgress = clampUnit(progress) * maxIndex;
  const segmentIndex = Math.min(Math.floor(scaledProgress), maxIndex - 1);
  const localProgress = scaledProgress - segmentIndex;

  if (localProgress <= TRANSITION_START) return segmentIndex;
  if (localProgress >= TRANSITION_END) return segmentIndex + 1;

  const transitionProgress = clampUnit(
    (localProgress - TRANSITION_START) / (TRANSITION_END - TRANSITION_START)
  );

  return segmentIndex + smoothStep(transitionProgress);
}

export function getActiveSlideIndex(slideProgress: number, slideCount: number) {
  if (slideCount <= 1) return 0;

  return Math.min(Math.max(Math.round(slideProgress), 0), slideCount - 1);
}

export function getSlideVisualState(index: number, activeIndex: number) {
  const isActive = index === activeIndex;

  return {
    blur: isActive ? 0 : 4.5,
    opacity: isActive ? 1 : 0.66,
    scale: isActive ? 1 : 0.955,
  };
}

export function getInterpolatedSlideVisualState(index: number, slideProgress: number) {
  const focus = smoothStep(1 - clampUnit(Math.abs(index - slideProgress)));

  return {
    blur: 4.5 * (1 - focus),
    opacity: 0.66 + 0.34 * focus,
    scale: 0.955 + 0.045 * focus,
  };
}

export function getPinnedCarouselIndex(progress: number, slideCount: number) {
  if (slideCount <= 1) return 0;

  return Math.min(Math.round(clampUnit(progress) * (slideCount - 1)), slideCount - 1);
}

export function getPinnedCarouselSlideProgress(progress: number, slideCount: number) {
  if (slideCount <= 1) return 0;

  const maxIndex = slideCount - 1;
  const scaledProgress = clampUnit(progress) * maxIndex;
  const segmentIndex = Math.min(Math.floor(scaledProgress), maxIndex - 1);

  if (progress >= 1) return maxIndex;

  const localProgress = scaledProgress - segmentIndex;
  if (localProgress <= PINNED_TRANSITION_START) return segmentIndex;
  if (localProgress >= PINNED_TRANSITION_END) return segmentIndex + 1;

  const transitionProgress = clampUnit(
    (localProgress - PINNED_TRANSITION_START) /
      (PINNED_TRANSITION_END - PINNED_TRANSITION_START)
  );

  return segmentIndex + smoothStep(transitionProgress);
}

export function getPinnedCarouselProgress(
  sectionTop: number,
  pinDistance: number,
  leadInDistance: number
) {
  const totalDistance = Math.max(pinDistance + Math.max(leadInDistance, 0), 1);

  return clampUnit((leadInDistance - sectionTop) / totalDistance);
}

export function getCarouselScrollDistance(viewportHeight: number, slideCount: number) {
  return Math.max(viewportHeight * 0.9 * Math.max(slideCount - 1, 1), 1);
}

export function getNextPinnedCarouselProgress(
  progress: number,
  deltaY: number,
  scrollDistance: number
) {
  return clampUnit(progress + deltaY / Math.max(scrollDistance, 1));
}

export function getNativeCarouselProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number
) {
  const scrollableDistance = Math.max(sectionHeight - viewportHeight, 1);

  return clampUnit(-sectionTop / scrollableDistance);
}

export function shouldEnterPinnedCarousel(
  sectionTop: number,
  sectionBottom: number,
  viewportHeight: number,
  scrollingDown: boolean,
  entryTolerance = PINNED_ENTRY_TOLERANCE
) {
  if (scrollingDown) {
    return sectionTop <= 0 && sectionTop >= -entryTolerance && sectionBottom > 0;
  }

  return (
    sectionTop < viewportHeight &&
    sectionBottom >= viewportHeight &&
    sectionBottom <= viewportHeight + entryTolerance
  );
}

export function getCarouselReleaseScrollY(
  sectionTop: number,
  sectionHeight: number,
  direction: "backward" | "forward",
  releaseNudge = Math.min(PINNED_RELEASE_NUDGE, Math.max(sectionHeight, 1))
) {
  if (direction === "forward") {
    return Math.ceil(sectionTop + releaseNudge);
  }

  return Math.max(Math.floor(sectionTop - releaseNudge), 0);
}

export function getCenteredSlideTranslate(
  slides: { offsetLeft: number; width: number }[],
  viewportWidth: number,
  activeIndex: number
) {
  const activeSlide = slides[activeIndex];
  if (!activeSlide || viewportWidth <= 0) return 0;

  return activeSlide.offsetLeft + activeSlide.width / 2 - viewportWidth / 2;
}

export function getFeaturedCarouselHeight(slideCount = 1) {
  const transitionCount = Math.max(slideCount - 1, 1);

  return `calc(100dvh + ${transitionCount * CAROUSEL_SCROLL_VH_PER_TRANSITION}dvh)`;
}

export function getPinnedCarouselSnapProgress(progress: number, slideCount: number) {
  if (slideCount <= 1) return 0;

  const maxIndex = slideCount - 1;
  const slideProgress = getPinnedCarouselSlideProgress(progress, slideCount);
  const activeIndex = getActiveSlideIndex(slideProgress + Number.EPSILON, slideCount);

  return activeIndex / maxIndex;
}

export function getPageSyncedHorizontalWheelDelta(
  event: CarouselWheelDelta,
  viewportHeight: number
) {
  if (event.ctrlKey) return 0;

  const absX = Math.abs(event.deltaX);
  const absY = Math.abs(event.deltaY);
  const deltaMode = event.deltaMode ?? 0;
  const multiplier =
    deltaMode === 1 ? WHEEL_LINE_DELTA_PX : deltaMode === 2 ? Math.max(viewportHeight, 1) : 1;
  const speedMultiplier = deltaMode === 2 ? 1 : HORIZONTAL_WHEEL_SCROLL_MULTIPLIER;

  if (event.shiftKey && absY > absX) {
    return event.deltaY * multiplier * speedMultiplier;
  }

  if (absX > absY) {
    return event.deltaX * multiplier * speedMultiplier;
  }

  return 0;
}

export function getPageSyncedDragScrollDelta(startClientX: number, currentClientX: number) {
  return (startClientX - currentClientX) * HORIZONTAL_DRAG_SCROLL_MULTIPLIER;
}
