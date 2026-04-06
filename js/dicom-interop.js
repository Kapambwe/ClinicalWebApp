/**
 * DICOM Viewer Blazor Interop
 * Exposes ES6 module exports to window object for Blazor JSInterop
 */

import * as dicomViewer from './dicom-viewer.js';
import * as dicomCine from './dicom-cine.js';

// ========================================
// Expose DICOM Viewer Functions
// ========================================

window.dicomViewer = {
    initialize: dicomViewer.initializeDicomViewer,
    loadImage: dicomViewer.loadDicomImage,
    loadImageStack: dicomViewer.loadDicomImageStack,
    activateTool: dicomViewer.activateDicomTool,
    zoomIn: dicomViewer.zoomInDicom,
    zoomOut: dicomViewer.zoomOutDicom,
    resetView: dicomViewer.resetDicomView,
    invert: dicomViewer.invertDicomImage,
    rotate: dicomViewer.rotateDicomImage,
    flipHorizontal: dicomViewer.flipDicomHorizontal,
    flipVertical: dicomViewer.flipDicomVertical,
    getImageInfo: dicomViewer.getDicomImageInfo,
    disable: dicomViewer.disableDicomViewer,
    loadSampleImage: dicomViewer.loadSampleDicomImage
};

// ========================================
// Expose DICOM Cine Functions
// ========================================

window.dicomCine = {
    init: dicomCine.initializeCinePlayback,
    play: dicomCine.playCine,
    pause: dicomCine.pauseCine,
    stop: dicomCine.stopCine,
    nextFrame: dicomCine.nextCineFrame,
    previousFrame: dicomCine.previousCineFrame,
    firstFrame: dicomCine.firstCineFrame,
    lastFrame: dicomCine.lastCineFrame,
    goToFrame: dicomCine.goToCineFrame,
    setFrameRate: dicomCine.setCineFrameRate,
    setDirection: dicomCine.setCineDirection,
    setLoopMode: dicomCine.setCineLoopMode,
    getState: dicomCine.getCineState,
    loadSample: dicomCine.loadSampleCine
};

console.log('DICOM Viewer Blazor Interop initialized');
