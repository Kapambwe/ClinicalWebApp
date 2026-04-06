/**
 * DICOM Viewer using Cornerstone.js
 * JavaScript module for viewing and manipulating DICOM medical images
 */

// ========================================
// DICOM Viewer Core Functions
// ========================================

// Initialize the DICOM viewer
export function initializeDicomViewer(elementId) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return false;
        }

        // Initialize Cornerstone Tools with external dependencies
        // This must be done before enabling the element
        if (!cornerstoneTools.isInitialized) {
            cornerstoneTools.external.cornerstone = cornerstone;
            cornerstoneTools.external.Hammer = Hammer;
            cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
            
            cornerstoneTools.init({
                mouseEnabled: true,
                touchEnabled: true,
                globalToolSyncEnabled: false,
                showSVGCursors: false
            });
            
            cornerstoneTools.isInitialized = true;
        }

        // Enable the element for Cornerstone
        cornerstone.enable(element);
        
        // Enable all tools
        setupDicomTools(element);
        
        console.log('DICOM Viewer initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DICOM viewer:', error);
        return false;
    }
}

// Setup interactive tools
function setupDicomTools(element) {
    // Add tools
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool); // Window/Level
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.LengthTool);
    cornerstoneTools.addTool(cornerstoneTools.AngleTool);
    cornerstoneTools.addTool(cornerstoneTools.EllipticalRoiTool);
    cornerstoneTools.addTool(cornerstoneTools.RectangleRoiTool);
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.MagnifyTool);

    // Set tool active states
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
}

// Load a DICOM image from URL
export function loadDicomImage(elementId, imageUrl) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return false;
        }

        cornerstone.loadImage(imageUrl).then(function(image) {
            cornerstone.displayImage(element, image);
            cornerstone.fitToWindow(element);
            console.log('Image loaded successfully');
        }).catch(function(error) {
            console.error('Error loading image:', error);
        });

        return true;
    } catch (error) {
        console.error('Error in loadDicomImage:', error);
        return false;
    }
}

// Load image stack (for series with multiple images)
export function loadDicomImageStack(elementId, imageUrls) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return false;
        }

        const stack = {
            currentImageIdIndex: 0,
            imageIds: imageUrls
        };

        cornerstone.loadImage(imageUrls[0]).then(function(image) {
            cornerstone.displayImage(element, image);
            cornerstoneTools.addStackStateManager(element, ['stack']);
            cornerstoneTools.addToolState(element, 'stack', stack);
            cornerstone.fitToWindow(element);
        }).catch(function(error) {
            console.error('Error loading image stack:', error);
        });

        return true;
    } catch (error) {
        console.error('Error in loadDicomImageStack:', error);
        return false;
    }
}

// Activate specific tool
export function activateDicomTool(toolName) {
    try {
        // Deactivate all tools first
        cornerstoneTools.setToolPassive('Wwwc');
        cornerstoneTools.setToolPassive('Pan');
        cornerstoneTools.setToolPassive('Zoom');
        cornerstoneTools.setToolPassive('Length');
        cornerstoneTools.setToolPassive('Angle');
        cornerstoneTools.setToolPassive('EllipticalRoi');
        cornerstoneTools.setToolPassive('RectangleRoi');
        cornerstoneTools.setToolPassive('Magnify');

        // Activate the selected tool
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
        
        console.log('Activated tool:', toolName);
        return true;
    } catch (error) {
        console.error('Error activating tool:', error);
        return false;
    }
}

// Zoom in
export function zoomInDicom(elementId) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.scale += 0.25;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error zooming in:', error);
        return false;
    }
}

// Zoom out
export function zoomOutDicom(elementId) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.scale -= 0.25;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error zooming out:', error);
        return false;
    }
}

// Reset view
export function resetDicomView(elementId) {
    try {
        const element = document.getElementById(elementId);
        cornerstone.reset(element);
        cornerstone.fitToWindow(element);
        return true;
    } catch (error) {
        console.error('Error resetting view:', error);
        return false;
    }
}

// Invert image colors
export function invertDicomImage(elementId) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error inverting image:', error);
        return false;
    }
}

// Rotate image
export function rotateDicomImage(elementId, degrees) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.rotation += degrees;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error rotating image:', error);
        return false;
    }
}

// Flip horizontal
export function flipDicomHorizontal(elementId) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error flipping horizontal:', error);
        return false;
    }
}

// Flip vertical
export function flipDicomVertical(elementId) {
    try {
        const element = document.getElementById(elementId);
        const viewport = cornerstone.getViewport(element);
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(element, viewport);
        return true;
    } catch (error) {
        console.error('Error flipping vertical:', error);
        return false;
    }
}

// Get image metadata
export function getDicomImageInfo(elementId) {
    try {
        const element = document.getElementById(elementId);
        const enabledElement = cornerstone.getEnabledElement(element);
        const image = enabledElement.image;
        
        return {
            width: image.width,
            height: image.height,
            rows: image.rows,
            columns: image.columns,
            slope: image.slope,
            intercept: image.intercept,
            windowCenter: image.windowCenter,
            windowWidth: image.windowWidth,
            minPixelValue: image.minPixelValue,
            maxPixelValue: image.maxPixelValue
        };
    } catch (error) {
        console.error('Error getting image info:', error);
        return null;
    }
}

// Cleanup/disable viewer
export function disableDicomViewer(elementId) {
    try {
        const element = document.getElementById(elementId);
        if (element) {
            cornerstone.disable(element);
        }
        return true;
    } catch (error) {
        console.error('Error disabling viewer:', error);
        return false;
    }
}

// Load sample DICOM image for demo
export function loadSampleDicomImage(elementId) {
    try {
        const sampleImageUrl = 'wadouri:https://rawgit.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CT1_J2KR';
        
        const element = document.getElementById(elementId);
        cornerstone.loadImage(sampleImageUrl).then(function(image) {
            cornerstone.displayImage(element, image);
            cornerstone.fitToWindow(element);
            console.log('Sample image loaded');
        }).catch(function(error) {
            console.error('Error loading sample image:', error);
            createDicomPlaceholder(elementId);
        });

        return true;
    } catch (error) {
        console.error('Error in loadSampleDicomImage:', error);
        return false;
    }
}

// Create a placeholder when no image is available
function createDicomPlaceholder(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;"><div style="text-align: center;"><div style="font-size: 48px; margin-bottom: 10px;">📷</div><div>DICOM Image Viewer</div><div style="font-size: 12px; margin-top: 10px;">Load a DICOM file to view</div></div></div>';
    }
}

// Initialize Cornerstone WADO Image Loader if available
if (typeof cornerstoneWADOImageLoader !== 'undefined') {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    
    cornerstoneWADOImageLoader.configure({
        beforeSend: function(xhr) {
            // Add headers here if needed
        }
    });
}

console.log('DICOM Viewer module loaded');
