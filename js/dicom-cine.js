/**
 * DICOM Cine Playback Module
 * Multi-frame playback functionality for DICOM image stacks
 */

// ========================================
// Cine Playback State
// ========================================

let cineState = {
    isPlaying: false,
    currentFrame: 0,
    totalFrames: 0,
    frameRate: 30,
    interval: null,
    direction: 1,
    loopMode: true,
    elementId: null
};

// ========================================
// Cine Playback Functions
// ========================================

// Initialize cine playback for an image stack
export function initializeCinePlayback(elementId, imageIds) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return false;
        }

        cineState.totalFrames = imageIds.length;
        cineState.currentFrame = 0;
        cineState.elementId = elementId;

        const stack = {
            currentImageIdIndex: 0,
            imageIds: imageIds
        };

        cornerstone.loadImage(imageIds[0]).then(image => {
            cornerstone.displayImage(element, image);
            cornerstoneTools.clearToolState(element, 'stack');
            cornerstoneTools.addStackStateManager(element, ['stack']);
            cornerstoneTools.addToolState(element, 'stack', stack);
            cornerstone.fitToWindow(element);
            console.log(`Cine initialized with ${cineState.totalFrames} frames`);
        }).catch(error => {
            console.error('Error loading initial frame:', error);
        });

        return true;
    } catch (error) {
        console.error('Error initializing cine:', error);
        return false;
    }
}

// Start playback
export function playCine(elementId) {
    if (cineState.isPlaying) return true;

    try {
        cineState.isPlaying = true;
        const intervalMs = 1000 / cineState.frameRate;

        cineState.interval = setInterval(() => {
            nextCineFrame(elementId);
        }, intervalMs);

        console.log(`Cine playback started at ${cineState.frameRate} FPS`);
        return true;
    } catch (error) {
        console.error('Error starting playback:', error);
        return false;
    }
}

// Pause playback
export function pauseCine() {
    if (!cineState.isPlaying) return true;

    try {
        cineState.isPlaying = false;
        if (cineState.interval) {
            clearInterval(cineState.interval);
            cineState.interval = null;
        }
        console.log('Cine playback paused');
        return true;
    } catch (error) {
        console.error('Error pausing playback:', error);
        return false;
    }
}

// Stop playback and reset to first frame
export function stopCine(elementId) {
    try {
        pauseCine();
        cineState.currentFrame = 0;
        goToCineFrame(elementId, 0);
        console.log('Cine playback stopped');
        return true;
    } catch (error) {
        console.error('Error stopping playback:', error);
        return false;
    }
}

// Go to next frame
export function nextCineFrame(elementId) {
    try {
        const element = document.getElementById(elementId);
        const stackData = cornerstoneTools.getToolState(element, 'stack');
        
        if (!stackData || !stackData.data || !stackData.data[0]) {
            console.error('No stack data found');
            return false;
        }

        const stack = stackData.data[0];
        let nextIndex = cineState.currentFrame + cineState.direction;

        // Handle looping
        if (nextIndex >= cineState.totalFrames) {
            if (cineState.loopMode) {
                nextIndex = 0;
            } else {
                pauseCine();
                return false;
            }
        } else if (nextIndex < 0) {
            if (cineState.loopMode) {
                nextIndex = cineState.totalFrames - 1;
            } else {
                pauseCine();
                return false;
            }
        }

        cineState.currentFrame = nextIndex;
        stack.currentImageIdIndex = nextIndex;

        cornerstone.loadImage(stack.imageIds[nextIndex]).then(image => {
            cornerstone.displayImage(element, image);
        }).catch(error => {
            console.error('Error loading frame:', error);
        });

        return true;
    } catch (error) {
        console.error('Error advancing to next frame:', error);
        return false;
    }
}

// Go to previous frame
export function previousCineFrame(elementId) {
    try {
        const element = document.getElementById(elementId);
        const stackData = cornerstoneTools.getToolState(element, 'stack');
        
        if (!stackData || !stackData.data || !stackData.data[0]) {
            return false;
        }

        const stack = stackData.data[0];
        let prevIndex = cineState.currentFrame - 1;

        if (prevIndex < 0) {
            prevIndex = cineState.loopMode ? cineState.totalFrames - 1 : 0;
        }

        cineState.currentFrame = prevIndex;
        stack.currentImageIdIndex = prevIndex;

        cornerstone.loadImage(stack.imageIds[prevIndex]).then(image => {
            cornerstone.displayImage(element, image);
        }).catch(error => {
            console.error('Error loading frame:', error);
        });

        return true;
    } catch (error) {
        console.error('Error going to previous frame:', error);
        return false;
    }
}

// Go to first frame
export function firstCineFrame(elementId) {
    return goToCineFrame(elementId, 0);
}

// Go to last frame
export function lastCineFrame(elementId) {
    return goToCineFrame(elementId, cineState.totalFrames - 1);
}

// Go to specific frame by index
export function goToCineFrame(elementId, frameIndex) {
    try {
        const element = document.getElementById(elementId);
        const stackData = cornerstoneTools.getToolState(element, 'stack');
        
        if (!stackData || !stackData.data || !stackData.data[0]) {
            return false;
        }

        if (frameIndex < 0 || frameIndex >= cineState.totalFrames) {
            console.error('Invalid frame index:', frameIndex);
            return false;
        }

        const stack = stackData.data[0];
        cineState.currentFrame = frameIndex;
        stack.currentImageIdIndex = frameIndex;

        cornerstone.loadImage(stack.imageIds[frameIndex]).then(image => {
            cornerstone.displayImage(element, image);
        }).catch(error => {
            console.error('Error loading frame:', error);
        });

        return true;
    } catch (error) {
        console.error('Error going to frame:', error);
        return false;
    }
}

// Set frame rate (FPS)
export function setCineFrameRate(fps) {
    try {
        if (fps < 1 || fps > 120) {
            console.error('Invalid frame rate. Must be between 1 and 120 FPS');
            return false;
        }

        const wasPlaying = cineState.isPlaying;
        
        if (wasPlaying) {
            pauseCine();
        }

        cineState.frameRate = fps;

        if (wasPlaying && cineState.elementId) {
            playCine(cineState.elementId);
        }

        console.log('Frame rate set to:', fps, 'FPS');
        return true;
    } catch (error) {
        console.error('Error setting frame rate:', error);
        return false;
    }
}

// Set playback direction (1 = forward, -1 = reverse)
export function setCineDirection(direction) {
    try {
        cineState.direction = direction === -1 ? -1 : 1;
        console.log('Playback direction set to:', cineState.direction === 1 ? 'forward' : 'reverse');
        return true;
    } catch (error) {
        console.error('Error setting direction:', error);
        return false;
    }
}

// Set loop mode
export function setCineLoopMode(enabled) {
    try {
        cineState.loopMode = enabled;
        console.log('Loop mode:', cineState.loopMode ? 'enabled' : 'disabled');
        return true;
    } catch (error) {
        console.error('Error setting loop mode:', error);
        return false;
    }
}

// Get current playback state
export function getCineState() {
    return {
        isPlaying: cineState.isPlaying,
        currentFrame: cineState.currentFrame,
        totalFrames: cineState.totalFrames,
        frameRate: cineState.frameRate,
        direction: cineState.direction,
        loopMode: cineState.loopMode
    };
}

// Create sample image stack for demo
function createSampleCineStack() {
    const baseUrl = 'wadouri:https://rawgit.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/';
    return [
        baseUrl + 'CT1_J2KR',
        baseUrl + 'CT2_J2KR',
        baseUrl + 'CT1_J2KI'
    ];
}

// Load sample cine for demonstration
export function loadSampleCine(elementId) {
    try {
        const sampleStack = createSampleCineStack();
        return initializeCinePlayback(elementId, sampleStack);
    } catch (error) {
        console.error('Error loading sample cine:', error);
        return false;
    }
}

console.log('DICOM Cine Playback module loaded');
