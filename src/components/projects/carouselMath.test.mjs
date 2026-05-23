import test from "node:test";
import assert from "node:assert/strict";

import {
  getCarouselScrollDistance,
  getCarouselReleaseScrollY,
  getNextPinnedCarouselProgress,
  getActiveSlideIndex,
  getCenteredSlideTranslate,
  getFeaturedCarouselHeight,
  getInterpolatedSlideVisualState,
  getNativeCarouselProgress,
  getPinnedCarouselIndex,
  getPinnedCarouselProgress,
  getPinnedCarouselSlideProgress,
  getSlideVisualState,
  getStagedSlideProgress,
  shouldEnterPinnedCarousel,
} from "./carouselMath.ts";

test("keeps exactly one featured project crisp during staged scroll", () => {
  for (const progress of [0, 0.24, 0.5, 0.76, 1]) {
    const slideProgress = getStagedSlideProgress(progress, 3);
    const activeIndex = getActiveSlideIndex(slideProgress, 3);
    const states = [0, 1, 2].map((index) => getSlideVisualState(index, activeIndex));

    assert.equal(states.filter((state) => state.blur === 0).length, 1);
    assert.equal(states[activeIndex].opacity, 1);
    assert.equal(states[activeIndex].scale, 1);
    assert.equal(states.filter((state) => state.blur > 0).length, 2);
  }
});

test("holds a slide before committing to the next snap point", () => {
  assert.equal(getActiveSlideIndex(getStagedSlideProgress(0.24, 3), 3), 0);

  assert.equal(getActiveSlideIndex(getStagedSlideProgress(0.76, 3), 3), 1);
});

test("maps pinned vertical scroll into one active horizontal project", () => {
  assert.equal(getPinnedCarouselIndex(0, 3), 0);
  assert.equal(getPinnedCarouselIndex(0.24, 3), 0);
  assert.equal(getPinnedCarouselIndex(0.25, 3), 1);
  assert.equal(getPinnedCarouselIndex(0.74, 3), 1);
  assert.equal(getPinnedCarouselIndex(0.75, 3), 2);
  assert.equal(getPinnedCarouselIndex(1, 3), 2);
});

test("calculates the translate needed to center the active slide", () => {
  const slides = [
    { offsetLeft: 0, width: 900 },
    { offsetLeft: 940, width: 900 },
    { offsetLeft: 1880, width: 900 },
  ];

  assert.equal(getCenteredSlideTranslate(slides, 1200, 0), -150);
  assert.equal(getCenteredSlideTranslate(slides, 1200, 1), 790);
  assert.equal(getCenteredSlideTranslate(slides, 1200, 2), 1730);
});

test("starts pinned carousel progress before the sticky top reaches the viewport", () => {
  const pinDistance = 1000;
  const leadInDistance = 200;

  assert.equal(getPinnedCarouselProgress(200, pinDistance, leadInDistance), 0);
  assert.equal(getPinnedCarouselProgress(0, pinDistance, leadInDistance), 1 / 6);
  assert.equal(getPinnedCarouselProgress(-600, pinDistance, leadInDistance), 2 / 3);
  assert.equal(getPinnedCarouselProgress(-1000, pinDistance, leadInDistance), 1);
});

test("eases toward the next project before snapping at the existing timing point", () => {
  assert.equal(getPinnedCarouselSlideProgress(0, 3), 0);
  assert.equal(getPinnedCarouselSlideProgress(0.05, 3), 0);

  const beforeFirstSnap = getPinnedCarouselSlideProgress(0.24, 3);
  assert.ok(beforeFirstSnap > 0 && beforeFirstSnap < 1);
  assert.equal(getPinnedCarouselSlideProgress(0.44, 3), 1);

  const beforeSecondSnap = getPinnedCarouselSlideProgress(0.7, 3);
  assert.ok(beforeSecondSnap > 1 && beforeSecondSnap < 2);
  assert.equal(getPinnedCarouselSlideProgress(0.94, 3), 2);
  assert.equal(getPinnedCarouselSlideProgress(1, 3), 2);
});

test("uses native sticky section scroll as carousel progress", () => {
  assert.equal(getNativeCarouselProgress(120, 1800, 720), 0);
  assert.equal(getNativeCarouselProgress(0, 1800, 720), 0);
  assert.equal(getNativeCarouselProgress(-540, 1800, 720), 0.5);
  assert.equal(getNativeCarouselProgress(-1080, 1800, 720), 1);
  assert.equal(getNativeCarouselProgress(-1400, 1800, 720), 1);
  assert.equal(getFeaturedCarouselHeight(3), "calc(100dvh + 164dvh)");
});

test("interpolates slide emphasis without a discrete mid-transition flip", () => {
  const outgoing = getInterpolatedSlideVisualState(0, 0.5);
  const incoming = getInterpolatedSlideVisualState(1, 0.5);
  const active = getInterpolatedSlideVisualState(1, 1);

  assert.equal(outgoing.opacity, incoming.opacity);
  assert.ok(active.opacity > incoming.opacity);
  assert.equal(active.blur, 0);
  assert.equal(active.scale, 1);
});

test("advances pinned carousel progress from wheel delta and clamps at bounds", () => {
  const distance = getCarouselScrollDistance(720, 3);

  assert.equal(getNextPinnedCarouselProgress(0, 0, distance), 0);
  assert.ok(getNextPinnedCarouselProgress(0, distance / 2, distance) > 0.49);
  assert.equal(getNextPinnedCarouselProgress(0.9, distance, distance), 1);
  assert.equal(getNextPinnedCarouselProgress(0.1, -distance, distance), 0);
});

test("only enters pinned mode near the carousel edge", () => {
  assert.equal(shouldEnterPinnedCarousel(-16, 704, 720, true), true);
  assert.equal(shouldEnterPinnedCarousel(-650, 70, 720, true), false);
  assert.equal(shouldEnterPinnedCarousel(20, 740, 720, false), true);
  assert.equal(shouldEnterPinnedCarousel(-120, 600, 720, false), false);
});

test("releases just past the carousel edge to avoid abrupt page jumps", () => {
  assert.equal(getCarouselReleaseScrollY(1000.25, 720, "forward"), 1067);
  assert.equal(getCarouselReleaseScrollY(1000.25, 720, "backward"), 934);
  assert.equal(getCarouselReleaseScrollY(20, 720, "backward"), 0);

  const forwardTarget = getCarouselReleaseScrollY(1000.25, 720, "forward");
  const releasedTop = 1000.25 - forwardTarget;
  const releasedBottom = releasedTop + 720;

  assert.equal(shouldEnterPinnedCarousel(releasedTop, releasedBottom, 720, true), false);
});
