**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/g_visualization.ipynb)**

Half of the fun with Jupyter Notebooks is organizing the data how you want.

But the most important part is how you can tell a story with that data.

The `jupyter-ijavascript-utils` library tries to give you a few different options:

# Showing your data through a Table


```javascript
utils = require('jupyter-ijavascript-utils');
['utils'];
```




    [ 'utils' ]




```javascript
JSON.stringify(
    utils.datasets.list().slice(0, 10)
);
```




    '["annual-precip.json","anscombe.json","barley.json","budget.json","budgets.json","burtin.json","cars.json","countries.json","crimea.json","driving.json"]'




```javascript
utils.ijs.await(async($$, console) => {
    cars = await utils.datasets.fetch('cars.json');
    console.log(`You have loaded ${cars.length} number of cars`);
});
```

    You have loaded 406 number of cars


**For more on tables, see the [Exporting and Tables tutorial](https://jupyter-ijavascript-utils.onrender.com/tutorial-h_exporting.html)**


```javascript
utils.table(cars)
    .limit(10)
    .filter((car) => car.Name.startsWith('chevrolet'))
    .sort('-Name')
    .styleRow(({record}) => record.Miles_per_Gallon > 20
             ? 'background-color:lightcyan' : '')
    .render(10);
```




<table cellspacing="0px" >
<tr >
	<th>Name</th>
	<th>Miles_per_Gallon</th>
	<th>Cylinders</th>
	<th>Displacement</th>
	<th>Horsepower</th>
	<th>Weight_in_lbs</th>
	<th>Acceleration</th>
	<th>Year</th>
	<th>Origin</th>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet woody</td>
	<td >24.5</td>
	<td >4</td>
	<td >98</td>
	<td >60</td>
	<td >2,164</td>
	<td >22.1</td>
	<td >1976-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet vega 2300</td>
	<td >28</td>
	<td >4</td>
	<td >140</td>
	<td >90</td>
	<td >2,264</td>
	<td >15.5</td>
	<td >1971-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet vega (sw)</td>
	<td >22</td>
	<td >4</td>
	<td >140</td>
	<td >72</td>
	<td >2,408</td>
	<td >19</td>
	<td >1971-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet vega</td>
	<td >20</td>
	<td >4</td>
	<td >140</td>
	<td >90</td>
	<td >2,408</td>
	<td >19.5</td>
	<td >1972-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet vega</td>
	<td >21</td>
	<td >4</td>
	<td >140</td>
	<td >72</td>
	<td >2,401</td>
	<td >19.5</td>
	<td >1973-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet vega</td>
	<td >25</td>
	<td >4</td>
	<td >140</td>
	<td >75</td>
	<td >2,542</td>
	<td >17</td>
	<td >1974-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet nova custom</td>
	<td >16</td>
	<td >6</td>
	<td >250</td>
	<td >100</td>
	<td >3,278</td>
	<td >18</td>
	<td >1973-01-01</td>
	<td >USA</td>
</tr>
<tr >
	<td >chevrolet nova</td>
	<td >15</td>
	<td >6</td>
	<td >250</td>
	<td >100</td>
	<td >3,336</td>
	<td >17</td>
	<td >1974-01-01</td>
	<td >USA</td>
</tr>
<tr >
	<td >chevrolet nova</td>
	<td >18</td>
	<td >6</td>
	<td >250</td>
	<td >105</td>
	<td >3,459</td>
	<td >16</td>
	<td >1975-01-01</td>
	<td >USA</td>
</tr>
<tr style="background-color:lightcyan;">
	<td >chevrolet nova</td>
	<td >22</td>
	<td >6</td>
	<td >250</td>
	<td >105</td>
	<td >3,353</td>
	<td >14.5</td>
	<td >1976-01-01</td>
	<td >USA</td>
</tr>
</table>



# Showing Through Vega Charts

For more, see the [Vega Charting Tutorial](http://localhost:8080/tutorial-vegaLite1.html)

## Vega-Lite

[Vega-Lite](https://vega.github.io/vega-lite) is a charting library that provides a great deal of flexibility and interaction
while also allowing for very simple use cases <br />
(and further simplified with [Vega-Lite-Api](https://vega.github.io/vega-lite-api/))
 
![Screenshot of vega lite examples from vega-lite home](img/vegaLiteExamples.png)

More examples and detail can be found on the [Vega module](https://jupyter-ijavascript-utils.onrender.com/module-vega.html)

## Vega

It is built on [Vega](https://vega.github.io/vega/) that uses [d3 as a visualization kernel](https://vega.github.io/vega/about/vega-and-d3/).

True [Vega](https://vega.github.io/vega/) is also supported, providing support for additional capabilities
(that to my knowledge cannot be done with vega-lite)
 *  such as [Radar Charts](https://vega.github.io/vega/examples/radar-chart/),
 * [Contour Plots](https://vega.github.io/vega/examples/contour-plot/),
 * [Tree Layouts](https://vega.github.io/vega/examples/tree-layout/),
 * [Force Plots](https://vega.github.io/vega/examples/force-directed-layout/),
 * and others.

![Screenshot of Vega Charts](img/vegaChartExamples.jpg)


```javascript
utils.vega.svg((vl) => vl.markPoint()
  .data(cars)
  .title('Displacement vs Horsepower')
  .width(500)
  .height(500)
  .transform(
    vl.filter('datum.Cylinders > 4')
  )
  .encode(
    //-- Qualitiative field - a number
    //-- that can have the position determined relative to another and charted
    vl.x().fieldQ('Displacement'),
    vl.y().fieldQ('Horsepower'),
    vl.color().fieldN('Origin').title('Car Origin').scale({ range: ['green', 'red', 'blue'] })
  )
)
```




    
![svg](output_11_0.svg)
    



![Screenshot of chart](img/CarsDisplacementByHorsepower.png)

## Data Driven Maps

![Map example](img/choropleth_workingFull.svg)

## Interactive Charts

![Screenshot of Vega-Lite with Sliders](img/vegaLiteSliders.png)

## Rendering Maps

You can use the [Leaflet]() module to render maps, or markers.

This leverages [Leaflet](https://leafletjs.com/) and [Leaflet-Provider](https://leaflet-extras.github.io/leaflet-providers/preview/)  to help you show locations, geometries, etc.

Please see the [leaflet module for more](https://jupyter-ijavascript-utils.onrender.com/module-leaflet.html)


```javascript
utils.leaflet.renderMarkers([
  [52.230020586193795, 21.01083755493164, "point 1"],
  [52.22924516170657, 21.011320352554325, "point 2"],
  [52.229511304688444, 21.01270973682404, "point 3"],
  [52.23040500771883, 21.012146472930908, "point 4"]
], {height: 400, provider: 'Stamen.Watercolor'});
```




<html><body>
  <div uuid="0c72b0cb-e083-40d1-917d-45f3b3c20e1c" style="width:100%; height: 400px"></div>
  <div scriptUUID="0c72b0cb-e083-40d1-917d-45f3b3c20e1c" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('0c72b0cb-e083-40d1-917d-45f3b3c20e1c', {
      scriptIndex: -1,
      scriptsToLoad: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js"],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        const rootEl = document.querySelector('div[uuid="0c72b0cb-e083-40d1-917d-45f3b3c20e1c"]');

        const options = {
          uuid: '0c72b0cb-e083-40d1-917d-45f3b3c20e1c',
          width: '100%',
          height: '400px',
          scripts: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js"],
          css: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = [[52.230020586193795,21.01083755493164,"point 1"],[52.22924516170657,21.011320352554325,"point 2"],[52.229511304688444,21.01270973682404,"point 3"],[52.23040500771883,21.012146472930908,"point 4"]];

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        if (!L.tileLayer.provider) console.error('Leaflet.tileLayer.provider is null');
        map = L.map(rootEl, {});

        L.tileLayer.provider('Stamen.Watercolor').addTo(map);

        (function leafletMarkersOnReady({ map, leaflet, data }) {
  const markerData = data;

  // eslint-disable-next-line new-cap
  const mapMarkers = markerData.map(([lat, lon, title], index) => new leaflet.marker([lat, lon])
    .bindPopup(title || String(index))
    .addTo(map));

  const markerGroup = leaflet.featureGroup(mapMarkers);

  map.fitBounds(markerGroup.getBounds().pad(0.2));
})({rootEl, data, map, leaflet:L, options});
        //-- ijsUtils.htmlScript options.onRender end

        console.log('IJSUtils.htmlScript:' + rootUUID + ' ending render');
      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('0c72b0cb-e083-40d1-917d-45f3b3c20e1c');
  </script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  crossorigin=""
  uuid="0c72b0cb-e083-40d1-917d-45f3b3c20e1c"
/>
</body></html>




![Screenshot of map](img/leafletRenderMarkers.png)

# Render Equations using Latex

Both [LaTeX](https://www.latex-project.org/) and [KaTeX](https://katex.org/) are supported.

[LaTeX](https://www.latex-project.org/) is a typesetting engine often used for writing mathematical formulas
along with technical and scientific documentation.
 
[KaTeX](https://katex.org/) is a very fast typesetting library specifically to write math notation.
It implements a subset of the LaTeX specification. 

Please see the [latex module for more](https://jupyter-ijavascript-utils.onrender.com/module-latex.html)


```javascript
utils.latex.render(String.raw`Given : $\pi = 3.14$ , $\alpha = \frac{3\pi}{4}\, rad$
$$
\omega = 2\pi f \\
f = \frac{c}{\lambda}\\
\lambda_0=\theta^2+\delta\\
\Delta\lambda = \frac{1}{\lambda^2}
$$`);
```




Given : $\pi = 3.14$ , $\alpha = \frac{3\pi}{4}\, rad$
$$
\omega = 2\pi f \\
f = \frac{c}{\lambda}\\
\lambda_0=\theta^2+\delta\\
\Delta\lambda = \frac{1}{\lambda^2}
$$



![Screenshot of Latex](img/latexExample.png)

# Render Diagrams through PlantUML

PlantUML Render diagrams in Jupyter Lab Renderer for PlantUML - a rendering engine that converts text to diagrams.

![Screenshot with PlantUML](img/plantumlSequence.png)

  All PlantUML diagrams are supported - as they are managed by the server.
  
  Such as:
*  <a href="https://plantuml.com/sequence-diagram">Sequence diagrams</a>,
*  <a href="https://plantuml.com/use-case-diagram">Usecase diagrams</a>,
*  <a href="https://plantuml.com/class-diagram">Class diagrams</a>,
*  <a href="https://plantuml.com/object-diagram">Object diagrams</a>,
*  <a href="https://plantuml.com/activity-diagram-beta">Activity diagrams</a>,
*  <a href="https://plantuml.com/component-diagram">Component diagrams</a>,
*  <a href="https://plantuml.com/deployment-diagram">Deployment diagrams</a>,
*  <a href="https://plantuml.com/state-diagram">State diagrams</a>,
*  <a href="https://plantuml.com/timing-diagram">Timing diagrams</a>,
*  and many others...

  ![Screenshot of types of PlantUML Diagrams](img/plantUmlDiagrams.jpg)
  
Please see the [PlantUML module for more](https://jupyter-ijavascript-utils.onrender.com/module-plantuml.html)

# Dynamically Generate SVGs for Diagrams

The utility here is a wrapper for [SVG.js](https://svgjs.dev/),
 so SVGs can be rendered either Server-Side (within the Notebook)
 or Client Side (within the browser rendering the notebook - but lost on export)



```javascript
  utils.svg.render({ width: 400, height: 200,
      onReady: ({el, width, height, SVG }) => {
          const yellowTransition = new SVG.Color('#FF0000').to('#00FF00');
          for (let i = 0; i <=5; i++){
              el.rect(100, 100)
                  .fill(yellowTransition.at(i * 0.2).toHex())
                  .transform(
                      new SVG.Matrix()
                          .translate(i * 20, 0)
                          .rotate(45)
                          .translate(100, 0)
                  );
          }
      }
  })

```




    
![svg](output_24_0.svg)
    



![Screenshot](img/svgRender_3.svg)

This also can be rendered on the client side to create your own animations.


```javascript
utils.svg.embed(({ el, SVG, width, height }) => {
    var rect1 = el.rect(100, 100)
        .move(width/2, 0);

    rect1.animate(1000, 0, 'absolute')
        .move(width/2, 100)
        .loop(true, true);
})
```




<html><body>
  <div uuid="2947c1b5-8f6f-4c50-958e-48878e8dc15c" style="width:400px; height: 200px"></div>
  <div scriptUUID="2947c1b5-8f6f-4c50-958e-48878e8dc15c" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('2947c1b5-8f6f-4c50-958e-48878e8dc15c', {
      scriptIndex: -1,
      scriptsToLoad: ["https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        const rootEl = document.querySelector('div[uuid="2947c1b5-8f6f-4c50-958e-48878e8dc15c"]');

        const options = {
          uuid: '2947c1b5-8f6f-4c50-958e-48878e8dc15c',
          width: '400px',
          height: '200px',
          scripts: ["https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"],
          css: ["https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        const el = SVG().addTo(rootEl);
const width = 400;
const height = 200;
el.size(width, height);

(({ el, SVG, width, height }) => {
    var rect1 = el.rect(100, 100)
        .move(width/2, 0);

    rect1.animate(1000, 0, 'absolute')
        .move(width/2, 100)
        .loop(true, true);
})({ rootEl, el, SVG, data, width, height, utilityFunctions, options, animate });
        //-- ijsUtils.htmlScript options.onRender end

        console.log('IJSUtils.htmlScript:' + rootUUID + ' ending render');
      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('2947c1b5-8f6f-4c50-958e-48878e8dc15c');
  </script>

</body></html>




![Screenshot of animation](img/svgAnimation1.gif)

Leveraging [Noise](https://jupyter-ijavascript-utils.onrender.com/tutorial-noiseVisualization.html) you can make some very interesting images even without data.

![Screenshot of animation](img/noiseFinal.gif)

# Extending with HTML Script

By balancing computing between the client and the browser side (through [HTMLScript]()) you can leverage additional libraries that can use the DOM.

![Screenshot](../img/htmlScript_qrCode.png)
              
        
For more, please see the [Architecture section](https://jupyter-ijavascript-utils.onrender.com/tutorial-architecture.html)
and the [HTMLScript tutorial](https://jupyter-ijavascript-utils.onrender.com/tutorial-d_htmlScriptAnimating.html)
