<p align="center">
    <a href="https://jupyter-ijavascript-utils.onrender.com/" alt="Documentation">
        <img src="https://img.shields.io/badge/Documentation-here-informational" />
    </a>
    <a href="https://jupyter-ijavascript-utils.onrender.com/LICENSE" alt="License">
        <img src="https://img.shields.io/badge/License-MIT-green" />
    </a>
    <img src="https://img.shields.io/badge/Coverage-98-green" />
    <a href="https://www.npmjs.com/package/jupyter-ijavascript-utils" alt="npm">
        <img src="https://img.shields.io/badge/npm-%5E1.X-red" />
    </a>
    <a href="https://github.com/paulroth3d/jupyter-ijavascript-utils" alt="npm">
        <img src="https://img.shields.io/badge/github-here-black" />
    </a>
    <a href="https://mybinder.org/v2/gh/paulroth3d/jupyter-ijavascript-utils/main" alt="Launch Binder">
                <img src="https://mybinder.org/badge_logo.svg" />
    </a>
</p>

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

## Running on Binder

[mybinder.org](https://mybinder.org/) is a great place to run a Jupyter Notebook online.

It means you can run Jupyter Notebooks with additional kernels without having to install anything,
and can try right in your browser.

Give it a try here:
[![Binder:what can I do with this](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/paulroth3d/jupyter-ijavascript-utils/main?labpath=example.ipynb)

## What's New
* 1.47 - Correct table rendering html if filter was used ({@link https://github.com/paulroth3d/jupyter-ijavascript-utils/issues/64|#64})
  * allow conversion from a Collection of Objects to Arrays and back with object. ({@link module:object.objectCollectionFromArray|object.objectCollectionFromArray}, {@link module:object.objectCollectionToArray|object.objectCollectionToArray})
  * Easier iterating over values and peeking with array with {@link module:array~PeekableArrayIterator|PeekableArrayIterator}
  * Support for delayed and asynchronous chaining of functions ({@link module:array.delayedFn|delayedFn}, {@link module:array.chainFunctions|chainFunctions}, etc)
* 1.46 - Make it easier to extract data from "hard-spaced arrays" - {@link module:array.multiLineSubstr}, {@link module:array.multiStepReduce}
* 1.45 - more ways to understand the data - {@link module:aggregate.coalesce|aggregate.coalesce()}, convert properties to arrow/dot notation / reverse it {@link module:object.flatten|object.flatten()} / {@link module:object.expand|object.expand()} and {@link module:object.isObject|object.isObject()}
* 1.43 - esm module fix since still not supported yet in ijavascript
* 1.41 - {@link module:object.propertyInherit|object.propertyInherit} - to simplify inheriting values from one record to the next
* 1.40 - {@link module:array.extract|array.extract} and {@link module:array.applyArrayValues|array.applyArrayValues} to allow for extracting values from arrays, transforming them on a separate process and applying them deeply and safely
* 1.39 - {@link module:format.extractWords|format.exportWords} - to identify distinct words in strings using unicode character properties
* 1.38 - {@link module:object.extractObjectProperty|object.extractObjectProperty} / {@link module:object.applyPropertyValue|object.applyPropertyValue} to allow for extracting values from arrays, transforming them on a separate process and applying them back
* 1.37 - {@link module:format.replaceString|format.replaceString} as convenience for replacing only a single string.
* 1.36 - {@link module:format.replaceStrings|format.replaceStrings} to allow for replacement dictionaries and tuplets
* 1.35 - {@link module:object.extractObjectProperties|extractObjectProperties} / {@link module:object.extractObjectProperty|extractObjectProperty} - to do horizontal transposes on objects
* 1.34 - {@link module:format.mapArrayDomain|format.mapArrayDomain} and add notes in the header of {@link module:random|random} on using non-uniform distributions.
* 1.33 - Object.augmentInherit and Object.union
* 1.32 - Array.indexify to identify sections within a 1d array into a hierarchy.
* 1.31 - harden Array.transpose for arrays with nulls, and Table.generateTSV
* 1.30 - add Format.wordWrap and Format.lineCount
* 1.29 - Updated TableGenerator.format method
* 1.28 - Sticky table headers for table.render
* 1.27 - Multi-Dimensional arange (initialize array along multiple dimensions)
* 1.26 - Support for file.writeFile and file.writeJSON to append
* 1.25 - Additional chain methods and documentation
* 1.24 - format.stripHtmlTags, TableGenerator.offset, chain.chainFlatMap, chain.chainFilter
* 1.23 - add format.parseNumber and TableGenerator.styleColumn, align group.separateByFields to vega-lite fold transform
* 1.22 - make chain iJavaScript aware, but still able to work outside of Jupyter
* 1.21 - include {@link module:chain|chain} - simple monoid
* 1.20 - fix vega dependency
* 1.19 - add in {@link module:describe|describe} and {@link module:hashMap|hashMap} modules, along with {@link module:format.limitLines|format.limitLines}
* 1.18 - tie to vega-datasets avoiding esmodules until ijavascript can support them
* 1.17 - provide object.propertyValueSample - as a way to list 'non-empty' property values
* 1.16 - provide file.matchFiles - as a way to find files or directories
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
| {@link module:chain}          | Simple wrapper (Monad-ish) that allows for chaining statements together                             |
| {@link module:datasets}       | Load example <a href="https://github.com/vega/vega-datasets">datasets provided by the vega team</a> |
| {@link module:describe}       | Similar to Pandas describe, provides statistics on a set of values / objects |
| {@link module:file}           | Read and write data/text to files.                                                                  |
| {@link module:format}         | Formatting and massage data to be legible.                                                          |
| {@link module:group}          | Group/Reduce Hierarchies of Object - generating Maps of records ({@link SourceMap})                 |
| {@link module:hashMap}        | Modify JavaScript HashMaps (ex new Map())             |
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

## ESM Modules + D3

Note that we strongly recommend using this with other modules like D3 - that only support ESM modules now.

There is a [known issue #210](https://github.com/n-riesco/ijavascript/issues/210) in the iJavaScript kernel.

So if you try to import libraries like d3 [and get comments like this](https://github.com/n-riesco/ijavascript/issues/279)

```
$ node -e "import defaultExport from './test.mjs'"
[eval]:1
import defaultExport from './test.mjs'
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at new Script (vm.js:88:7)
    at createScript (vm.js:263:10)
    at Object.runInThisContext (vm.js:311:10)
    at Object.<anonymous> ([eval]-wrapper:10:26)
    at Module._compile (internal/modules/cjs/loader.js:1151:30)
    at evalScript (internal/process/execution.js:94:25)
    at internal/main/eval_string.js:23:3
```

### Use [esm-hook](https://github.com/alex-kinokon/esm-hook) as a workaround for now.

```
require("esm-hook"); // must come before requiring esm modules
d3 = require('d3');  // import esm modules
```

More is found on the documentation for [issue #210](require("esm-hook"))