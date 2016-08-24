# childcaredeserts
**Collaborators:** Raheed Malik  
**Team:** Early Childhood  
**Goal:** Visualize zipcodes with low access to quality child care and how it correlates the the area's race and income   
**Audience:**  

A dataset of child care centers for GA, NC, MN, IL, VA, MD, OH, CO, and WA with quality (QRIS) ratings. Each state has a different rating, so we normalize to 3 tiers (top, middle, and bottom) with a 4th category that simply qualifies the center as "licensed." These centers will be overlayed on top of a base layer of zipcode boundaries, shaded by zipcode demographic characteristics.

For the base layer, we’ve decided on four metrics, using a toggle or dropdown:

 - **Population density** using the 2010 Census file in the dropbox + a dataset that has square miles for each ZCTA in 2010 Census.
 - **Mean Reported Earnings** using the IRS data, dividing the amount of salaries and wages in AGI (Excel: column J) by the number of tax returns (Excel: column I) in each ZCTA.
 - **Percent African American** using the 2010 Census ZCTAs
 - **Percent Hispanic/Latino** using the 2010 Census ZCTAs

 User should be able to toggle between zipcode characteristics and hover over a center to see more details.

 
# Developer Notes
* [Requirements](#requirements)
* [Quick start](#quick-start)
* [Project Architecture](#project-architecture)
* [Performance Concerns](#performance-concerns)
* [Work Remaining](#work-remaining)

## Requirements
* node `^4.2.0`
* npm `^3.0.0`

## Quick start
* Clone this repository `git clone https://github.com/amprog/childcaredeserts.git`
* Install dependencies `npm install`
* Running `npm start` will start a dev server on port 8080


![Alt][1]
_Child Care Deserts development_


## Project Architecture
Within the download you'll find the following directories and files, logically grouping common modules.


```
childcaredeserts/
├── bin/
│   ├── munge
│   ├── topo
├── public/ // resources like images, csvs, and geoJson files
│   └── data/
│       ├── zips/ // all zip code topojson and geojson files
│       │   ├──  zips_*.geo.json
│       │   └──  zips_*.topo.json
│       └── childCareCenters.tsv // data for each child care dot
├── js/
│   ├── api/ 			// AJAX related code
│   ├── ui/ 			// React-Redux related code
│   ├── index.js		// Main entry point. Creates Redux store and React root node
├── sass/    // SASS modules for typography, colors, layout, etc
└── views/   // Mustache-related views used by build system
   
```

[1]: https://cloud.githubusercontent.com/assets/1424223/17936705/4a9d8952-69e5-11e6-86c8-a8b7621b3307.png "Image of Child Care Deserts development"

This project primarily uses React, Redux, and Mapbox GL to load, filter, and render geospatial data. 

The `ui/` directory divides the app into to primary parts: `sidebar/` and `map/`. The `component`s and `container`s located in `sidebar/` do most of the heavy lifting for filtering, selection, and loading data.

`map/` uses `component`s to divide the MapboxGL map into a map, a camera, and layers. Panning and zooming to features is done by `MapboxGl.component.camera.js`, while the various data layers (e.g. Child Care locations and state ZIP codes) are loaded and removed via `MapboxGl.component.layer.js`.

All state changes are made through Redux and provided to each React component via `react-redux` `connect`.


## Performance Concerns
Displaying thousands of data points comes at a performance price. This section outlines performance bottlenecks encountered, and what we did to ameliorate them.

### Download size
The project's data for Child Care Centers `childCareCenters.tsv` is 2.8MB alone. Other files, such as the `*.geo.json` files located in `zips/` can be from 1MB to 5MB in size. Use of gzip when sending files over the wire is highly recommended.

### Mapbox GL source/layer count
Mapbox uses a thing called a data `source` to create visual `layer`s. If the size of the source is too large, performance takes a significant hit. In order to reduce the impact of rendering 25k child care centers, we _downsampled_ the size of the data set when viewed at the national view.  When a user selects a state, we replaced the child care center `source` with the all the state's child care centers.

### Mapbox GL ZIP codes
For ZIP codes, `topojson` is a natural fit because of its file size. However, decompressing `topojson` files on the client and loading them into Mapbox GL proved to have a significant performance hit. We decided to use `url`s instead, which allow Mapbox GL to load everything via web workers. However, all sources must be `geojson` instead, which comes at a significantly larger size. `mapshaper` was employed to find a compromise between file size and visual fidelity.

## Work Remaining
Due to changing assumptions driven by performance, several parts of work remain.

### Update ZIP code data
The data for each zip code is stored as `geojson`. However, the actual points of data, i.e. mean earnings, population density, percent African-American, and percentage Latino are either not present, or described as non-numeric strings or null. This causes Mapbox GL's data-driven layers to fail. All zip code geojson data must be updated and must pass quality assurance from relevant stakeholders. 

Currently, only Colorado is working for ZIP codes.

1. Ensure all ZIP code properties are numeric and not strings
2. Ensure all ZIP code properties are non-null
3. Ensure all ZIP code properties have consistent units accross all states (e.g. thousands vs tens)

The easiest way to do this is to update either a csv or an excel document, and then use `topojson`'s console api to marry the zip code in the spreadsheet to the zipcode in the geojson.

### Create high level design documents
Typography, layout, have not yet been built into this project. This project is therefore only a technical proof of concept and is not ready for audiences.
