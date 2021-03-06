# Overview

This is a library to help people that understand JavaScript
to leverage for using Jupyter with the iJavaScript kernel
as a way to load and explore data, and ultimately tell compelling stories with visuals.

Jupyter is a way to programmatically explore a subject and interleave text and markdown to make Data Driven Documents.

See the [#Installation section for requirements and installation](#install)

Notebooks are a way to explore and experiment, in addition to write and explain ideas.

**All of the tutorials provided here, including this one, was written as a notebook and simply exported.**

![Screenshot](img/started_jupyterSideBySide.jpg)

The document itself is a list of cells that can be either:
* Text or Markdown (like this)
* Or executable Code (NodeJS code in this case)
    * rendering images, interactive charts, maps or even generated text based on data.

![Screenshot showing generated markdown](img/started_generatedText.jpg)

**note: You can choose whether to show the code or simply show the results.**

## This Library helps with the Coding Side of Things

The [jupyter-ijavascript-utils](https://www.npmjs.com/package/jupyter-ijavascript-utils) library is simply a collection of utility methods for Node and JavaScript Developers interested in Data Science.

* **Load**
    * (ex: {@link module:file}, {@link module:datasets} or the {@tutorial e_gettingData} tutorial)
* **Manipulate and Refine**
    * (ex: {@link module:array}, {@link module:object}, or {@link module:set})
* **Aggregate, Manipulate and Explore**
    * (ex: {@link module:group}, {@link module:aggregate} or the {@tutorial f_dataframes} tutorial)
* **Format / Visualize**
    * (ex: {@link module:format}, {@link module:vega}, or the {@tutorial g_visualization} tutorial)
* **Export**
    * (ex: {@link TableGenerator}, or the {@tutorial h_exporting} tutorial)

Currently, we assume you'll be using [nriesco's iJavaScript Jupyter Kernel](https://github.com/n-riesco/ijavascript) and the [Jupyter Lab - the latest interface for Jupyter](https://jupyter.org/) - and the installation is fairly simple in the {@tutorial howToUse} guide. (Although suggestions welcome)

This is not intended to be the only way to accomplish many of these tasks, and alternatives are mentioned in the documentation as available.

![Screenshot of example notebook](img/mainExampleNotebook.png)

## What's New

* 1.15 - provide {@link module:object.formatProperties|object.formatProperties} - as a way to quickly convert to string, number, etc.
* 1.14 - provide {@link module:object.mapProperties|object.mapProperties()} and {@link module:format.compactNumber|format.compactNumber()}
* 1.13 - provide {@link module:random|utils.random()} to genrate random values
* 1.12 - provide `utils.table(...)` instead of `new utils.TableGenerator(...)`
* 1.11 - provide {@link module:aggregate.topValues|topValues} (like top 5, bottom 3)
* 1.10 - provide {@link module:aggregate.percentile|percentile} (like 50th percentile) aggregates
* 1.9 - allow {@link TableGenerator#transpose|transposing results} on TableGenerator.
* 1.8 - add in What can I Do tutorial, and {@link module:object.join|object.join methods}
* 1.7 - revamp of `animation` method for ijs.htmlScript
* 1.6 - add SVG support for rendering SVGs and animations with {@link module:svg}.
* 1.5 - Add LaTeX / KaTeX support with {@link module:latex} for rendering Math formulas and PlantUML support for Diagrams
* 1.4 - Add in vega embed, vega mimetypes with {@link module:vega} and example choropleth tutorial
* 1.3 - Add {@link module:leaflet|Leaflet} for Maps, allow Vega to use {@link module:vega.svgFromSpec|explicit specs} (so [Examples can be copied and pasted](https://vega.github.io/vega-lite/examples/), and add in {@link module:ijs.htmlScript|htmlScripts}

-------

# Module Overview

| Export | Description                                                                                                                |
|-------------------------------|-----------------------------------------------------------------------------------------------------|
| {@link module:aggregate}      | Aggregate collections or collections of objects (ex: min, max, unique, contains, etc.               |
| {@link module:array}          | Massage, sort, reshape arrays.                                                                      |
| {@link module:base64}         | Convert to and from base64 encoding of strings                                                      |
| {@link module:datasets}       | Load example <a href="https://github.com/vega/vega-datasets">datasets provided by the vega team</a> |
| {@link module:file}           | Read and write data/text to files.                                                                  |
| {@link module:format}         | Formatting and massage data to be legible.                                                          |
| {@link module:group}          | Group/Reduce Hierarchies of Object - generating Maps of records ({@link SourceMap})                 |
| {@link module:ijs}            | Extend iJavaScript to support await, and new types of rendering - like {@tutorial htmlScript} and markdown|
| {@link module:latex}          | Render Math Notation with <a href="www.latex-project.org">LaTeX<a> and <a href="katex.org">KaTeX</a>|
| {@link module:leaflet}        | Render maps with <a href="leaflet.org">Leaflet</a>                                                  |
| {@link module:object}         | Massage and manipulate Objects or Collections of Objects.                                           |
| {@link module:plantuml}       | Render <a href="https://plantuml.com">PlantUML</a> within Jupyter results.                          |
| {@link module:random}         | Generate random values, pick from arrays, or create natural looking images based on 2d/3d space.    |
| {@link module:set}            | Functional Utilities for managing JavaScript Sets - allowing for chaining.                          |
| {@link module:svg}            | Programmatically create SVGs (either jupyter side for exports, or client side for animations)       |
| {@link module:vega}           | Generate Charts / Graphs / Maps with <a href="https://vega.github.io/vega/">Vega</a> and <a href="https://vega.github.io/vega-lite/">Vega-Lite</a>                                         |
| {@link SourceMap}             | SubClass of Maps - generated by the {@link module:group} and reducible with {@link module:aggregate}|
| {@link TableGenerator}        | Class that can filter, sorts, manage and then generate HTML, CSV, Markdown, etc.                    |

-------

# For Example

## Get Sample Data

({@link module:datasets|See the DataSets module for more on sample datasets})

({@link module:ijs.await|See the ijs module for helpers to use async/await})

```
//-- get the data
utils.ijs.await(async ($$, console) => {
	barley = await utils.datasets.fetch('barley.json');

	//-- continue to use the barley dataset, or wait to the next cell
});
```

## Group By

Then we can group using a process similar to d3js

({@link module:group|see the Group module for more on grouping})

```
//-- get the min max of the types of barley
barleyByVarietySite = utils.group.by(barley, 'variety', 'site')

// SourceMap(10) [Map] {
//   'Manchuria' => SourceMap(6) [Map] {
//     'University Farm' => [ [Object], [Object] ],
//     'Waseca' => [ [Object], [Object] ],
//     'Morris' => [ [Object], [Object] ],
//     'Crookston' => [ [Object], [Object] ],
//     'Grand Rapids' => [ [Object], [Object] ],
//     'Duluth' => [ [Object], [Object] ],
//     source: 'site'
//   },
//   'Glabron' => SourceMap(6) [Map] {
//     'University Farm' => [ [Object], [Object] ],
//     'Waseca' => [ [Object], [Object] ],
//     'Morris' => [ [Object], [Object] ],
//     'Crookston' => [ [Object], [Object] ],
//     'Grand Rapids' => [ [Object], [Object] ],
//     'Duluth' => [ [Object], [Object] ],
//     source: 'site'
//   },
//   ...
// }

//-- now group by variety and year
barleyByVarietyYear = utils.group.by(barley, 'variety', 'year')

// SourceMap(10) [Map] {
//   'Manchuria' => SourceMap(2) [Map] {
//     1931 => [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     1932 => [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     source: 'year'
//   },
//   'Glabron' => SourceMap(2) [Map] {
//     1931 => [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     1932 => [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     source: 'year'
//   },
//   ...
// }
```

##  Aggregating

({@link module:aggregate|See the Aggregation module for more})

```
utils.group.by(barley, 'variety', 'site')
    .reduce((collection) => ({
        years: utils.aggregate.extent(collection, 'year'),
        numRecords: utils.aggregate.length(collection),
        yield_sum: utils.aggregate.sum(collection, 'yield'),
        yield_min: utils.aggregate.min(collection, 'yield'),
        yield_max: utils.aggregate.max(collection, 'yield'),
        yield_diff: utils.aggregate.difference(collection, 'yield')
    }));

returns
[
  {
    variety: 'Manchuria',
    site: 'University Farm',
    years: { min: 1931, max: 1932 },
    numRecords: 2,
    yield_sum: 53.9,
    yield_min: 26.9,
    yield_max: 27,
    yield_diff: 0.100
  },
  {
    variety: 'Manchuria',
    site: 'Waseca',
    years: { min: 1931, max: 1932 },
    numRecords: 2,
    yield_sum: 82.33333,
    yield_min: 33.46667,
    yield_max: 48.86667,
    yield_diff: 15.39999
  },
  ...
];
```

## Render as a Table

({@link TableGenerator|See the TableGenerator class for more})

```
new utils.TableGenerator(barley)
    .sort('-yield')
    .formatter({ year: (v) => `${v}`})
    .limit(10)
    .render()
```

![Screenshot of table](img/BarleySimpleTable.png)

## Show a Graph

(See the {@tutorial vegaLite1} tutorial or the {@link module:vega|Vega module} for more)

```
//-- make a point chart
utils.vega.svg((vl) => vl.markPoint()
    //-- data as an array of items
    .data(barley)
    .title('Barley Yield by Site')
    .width(600)
    .encode(
        //-- x position is Nominal - not a number
        vl.x().fieldN('site'),
        //-- y position is Quantitative - a number
        vl.y().fieldQ('yield'),
        //-- Color is based on the year field
        vl.color().fieldN('year')
    )
)
```

![Screenshot of Vega Cell](img/BarleyYieldBySite.png)

Where making it into a bar chart, to understand the proportions of varieties grown is simply changing the mark type

```
// change from markPoint to markBar
utils.vega.svg((vl) => vl.markBar()
    //-- data as an array of items
    .data(barley)
    .title('Barley Yield by Site Variety')
    .width(600)
    .encode(
        //-- x position is Nominal - not a number
        vl.x().fieldN('site').title('Site'),
        //-- y position is Quantitative - a number
        vl.y().fieldQ('yield').title('Yield'),
        //-- Color is based on the variety field
        vl.color().fieldN('variety').title('Variety')
    )
)
```

![Screenshot of variety type](img/BarleyYieldBySiteVariety.png)

With further options to zoom, pan, or setup interactive sliders:

![Screenshot of vega lite with sliders](img/vegaLiteSliders.png)

Or try your hand at the [Vega Lite Examples](https://vega.github.io/vega-lite/examples/) and more from {@link module:vega}

![Screenshot of Vega-Lite Examples](img/vegaLiteExamples.png)

## Create a Data Driven Map

(See the {@tutorial vega_choroplethShort} tutorial for more)

![svg](img/choropleth_workingFull.svg)

## Render Maps

({@link module:leaflet|See the Leaflet module for more})

![Screenshot of Leaflet](img/leafletRenderMarkers.png)

## Generate Text Driven Diagrams

({@link module:plantuml|See the PlantUML module for more})

![Screenshot of PlantUML](https://jupyter-ijavascript-utils.onrender.com/img/plantumlSequence.png)

## Render Other Libraries

(See the {@tutorial htmlScript} tutorial for more)

```
utils.ijs.htmlScript({
    scripts: ['https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'],
    height: '100%',
    onReady: ({rootEl}) => {
        new QRCode(rootEl, "https://jupyter-ijavascript-utils.onrender.com/");
    }
});
```

![Screenshot of QR Code](img/htmlScript_qrCode.png)

## Create Animations

(See the {@tutorial noiseVisualization} tutorial or {@link module:svg|svg module} for more)

![Screenshot of dark animation](img/svgAnimation2Dark.gif)
![Screenshot of light animation](img/svgAnimation2Light.gif)

<a name="install">&nbsp;</a>
# Install

Note that some of the utilities assumes you are running within Jupyter - within n-riesco's iJavaScript kernel (that provides JavaScript language support within Jupyter)

`npm install jupyter-ijavascript-utils`

Depends on:

* [Jupyter Tools - such as Jupyter Lab](https://jupyter.org/)
* [n-riesco/ijavascript jupyter kernel](https://github.com/n-riesco/ijavascript#installation)

See the [How to Use]{@tutorial howToUse} section for more.
