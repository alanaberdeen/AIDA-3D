# 3D experiments

Stephen shared data back in April - 3D images of fluorescence labeled cell nuclei

## Pipeline

1. Crop z-stack to ~200 slices (was crashing webGL)
2. Convert to .nrrd ([nearly raw raster data](http://teem.sourceforge.net/nrrd/descformat.html)) format
3. Convert to 8bit (THREE.js throws textures errors for 16bit, should be temporary)
4. Use loaders to read .nrrd file
5. Use volume ray-casting to render the textures on a surface.

**Challenges:**

1. At the moment, very large images seem to crash the webGL context in browser. Compressing data with gzip to could help?
2. Need to think a bit about the best way to package image files securely with the site rather than requesting from cloud storage due to latency.
3. Uncertainty on end-user environment and GPU access might mean inconsitent perfomance and difficult to resolve bugs.
4. Find issue with 16bit, shouldn't be a restriction.

Ralf previously mentioned [VTK.js](https://kitware.github.io/vtk-js/) or [OpenCV.js](https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html). These could be alternative options and might help with some of the challenges.

## Questions

- Will this be multi channel?
- Channels for segmentation? How will segmentation be managed?
- What kind of manual annotation tasks/pipeline do we want to support? What's definitley required and what would be nice to have?
- Visualisation vs interaction tradeoffs?
- The data included a few ROI's - what are these in reference to?

## Notable points

- If we switch to 3D models rather than image stacks it would be preferable to establish a workflow around [glTF](https://en.wikipedia.org/wiki/GlTF) (GL Transmission Format). Because glTF is focused on runtime asset delivery, it is compact to transmit and fast to load.
- [3D tiles](https://github.com/CesiumGS/3d-tiles) might be of interest - *"an open specification for sharing, visualizing, fusing, and interacting with massive heterogenous 3D geospatial content across desktop, web, and mobile applications."*
