/**
 * Global scroll state manager
 * 
 * This bypasses React state updates which can cause delays in camera animations.
 * Values are updated directly by ScrollTrigger and read by useFrame in CameraController.
 */

interface ScrollState {
    /** Overall scroll progress from 0 to 1 */
    globalProgress: number;
    /** Current segment index (0 to trips.length - 2) */
    segmentIndex: number;
    /** Progress within current segment (0 to 1) */
    segmentProgress: number;
    /** Total number of segments */
    segmentCount: number;
}

// Global mutable state - this is intentionally NOT React state
// so that useFrame can read it synchronously without waiting for re-renders
export const scrollState: ScrollState = {
    globalProgress: 0,
    segmentIndex: 0,
    segmentProgress: 0,
    segmentCount: 1,
};

/**
 * Update the global scroll state
 * Called directly by ScrollTrigger.onUpdate
 */
export function updateScrollState(
    globalProgress: number,
    segmentCount: number
): void {
    scrollState.globalProgress = globalProgress;
    scrollState.segmentCount = segmentCount;

    // Calculate segment index and progress
    const exactSegment = globalProgress * segmentCount;
    const rawIndex = Math.floor(exactSegment);

    // Clamp index to valid range (0 to segmentCount - 1)
    scrollState.segmentIndex = Math.max(0, Math.min(rawIndex, segmentCount - 1));

    // Calculate progress within segment (0 to 1)
    // Special handling for last segment to avoid progress > 1
    if (rawIndex >= segmentCount) {
        scrollState.segmentProgress = 1;
    } else {
        scrollState.segmentProgress = exactSegment - scrollState.segmentIndex;
    }
}

/**
 * Get current scroll state (for useFrame)
 */
export function getScrollState(): ScrollState {
    return scrollState;
}
