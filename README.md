# AIDA 3D

## What is AIDA

AIDA is an attempt to bring an open source web-based work-flow to image annotation.

AIDA is a web interface that enables distributed teams of researchers to directly annotate images with easy to use on screen drawing tools. AIDA supports the creation of well defined annotation trials which include a series of high resolution images and a specific set of annotation tasks.

For documentation and further information see the [AIDA repository](https://github.com/alanaberdeen/AIDA).

## What is AIDA-3D?

AIDA-3D combines the 2D viewer from AIDA with a corresponding 3D viewer for semantic segmentation of tiled regions.

## How has it been implemented?

The user interface is a React [NextJS](https://nextjs.org/) Single Page Application.

The 2D viewer is built on [OpenLayers](https://openlayers.org/) to provide the images and drawing functionality. The 3D viewer is built on [three.js](https://threejs.org/).

## License

The software is published as Open Source under the permissive [MIT license](https://github.com/alanaberdeen/AIDA/blob/master/LICENSE).

## Run Locally

You can use AIDA-3D on your local machine. The only requirement [NodeJS](https://nodejs.org/en/).

1. Clone the repository
2. Install the dependencies via [NPM](https://www.npmjs.com/) `npm install`
3. Run the build script `npm run build`
4. Add the images and their corresponding 3D segmentation to the `/local/data/` directory.
5. Create a .json config file in the `/local/data/` directory with two properties 'image' the local path to the 2D image and 'tiles' the local path to the 3D segmentation.
6. Run the local server application via `npm run start`
7. Navigate to the localhost webserver specified in the console

## Develop

Requirement [NodeJS](https://nodejs.org/en/).
Example work-flow:

1. Clone the repository
2. Install dependencies via `npm install`
3. For development: start a hot-reloading dev server with `npm run start`
4. For deployment: bundle together with `npm run build`

## Support for tiled images, International Image Interoperability Framework (IIIF)

This removes the requirement for DZI file formats and replaces it with a web-server. At this point it is still a bit experimental.

- Deploy Cantaloupe IIIF server as described [here](https://cantaloupe-project.github.io/).
- Edit the Cantaloupe configuration file so that `FilesystemSource.BasicLookupStrategy.path_prefix` points to `/local/data`.
- Cataloupe server must be running at 'localhost:8182'
- Currently only TIFF files are supported.

## About

This application was built by [Alan Aberdeen](https://github.com/alanaberdeen) with the support of [NCI at NIH](https://www.nih.gov/about-nih/what-we-do/nih-almanac/national-cancer-institute-nci) and the [Quantitative Biological Imaging Group](http://www.ludwig.ox.ac.uk/jens-rittscher-group-page), The University of Oxford.
