**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/ex_HtmlScript.ipynb)**

There may be times you would like to leverage client (browser side) technologies, 
such as CDN libraries to do things you couldn't do in Jupyter otherwise

![Screenshot of QR Code](img/htmlScript_qrCode.png)

...make things interactive,

![Screenshot of sliders with Vega Lite](img/vegaLiteSliders.png)

...or even show animations

![circle animation](img/svgAnimation2Dark.gif)

**then you need to render client side / on the browser**
using JavaScript (with a little bit of HTML)

This is the purpose of [ijs.htmlScript()](https://jupyter-ijavascript-utils.onrender.com/module-ijs.html#.htmlScript)

# When to use the HTML Script?

Give it a try if you want to:

* execute javascript on the browser / client side
* Run animations
* Allow cell results to be 'interactive'

The purpose of the method is to:

* load javascript / css etc in a dependably serial way.
    * (Note that by rendering output, browsers use dynamic html, and therefore may load before scripts, and also do not load in order)
* Execute JavaScript once 'ready'

## When Not To Use It

**NOTE: the iJavaScript team worked very hard on various export formats**

Such as:

* `$$.html(string)` - render a string as html in the output
* `$$.svg(string)` - render a string as svg directly in the output

etc.

If you simply wish to generate out html and svg and just render it to output,
perhaps the `htmlScript` isn't needed.

Jupyter Notebooks run JavaScript, but within a Node kernel (environment).

In the case for htmlScript, we can serialize the `onReady` function,
and ensure the dynamic loading of the required scripts are indeed serial,
so we can dependably load javascript in order and then run code in the browser.

![Sequence Diagram for HTML Script execution](img/architecture_output19.svg)

Please see the Client Side / HTML Script section in the {@tutorial architecture} document for more.

More is also available on the {@link module:ijs.htmlScript} documentation page


```javascript
utils = require('jupyter-ijavascript-utils');
['utils loaded']
```




    [ 'utils loaded' ]



## For a simple example

We would like to pull in a script off a CDN, and tell it to run some JavaScript when the script finished loading.

Note in this case, the onReady function is passed a single argument with child properties.

We only need to grab the properties we care about (through [descructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)).
                                                                           
In this case, the `onReady` element that is specific to this result render is then passed and used in JavaScript code.
                                            


```javascript
utils.ijs.htmlScript({
    scripts: ['https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'],
    height: '100%',
    html: '<p>You can also include html, and then reference it as a child of the rootEl element</p>',
    onReady: ({rootEl}) => {
        new QRCode(rootEl, "https://jupyter-ijavascript-utils.onrender.com/");
    }
});
```




![Screenshot of QR Code](img/htmlScript_qrCode.png)

# onReady and Client Side JavaScript

The code we are writing in this case is technically NodeJS, but `htmlScript` packages up the onReady definition to be executed by the browser in JavaScript.

Only the code specified in the `onReady` and `utilityScripts` parameters are converted to JavaScript, and at this time **we do not use transpilers in conversion**.

This means that only variables and values passed in the options are available.

## Simple Failure Example

Said the other way, this following example will not work - because libraries and variables are defined outside of the function and not included in the bundle.

In this case we are referencing the node variable of `utils` - used in the notebook.

But quite nicely, we can use the Browser Inspector and tell what is wrong. (Or even do step-by-step debugging)


```javascript
utils.ijs.htmlScript({
    height: 200,
    onReady: ({ rootEl }) => {
        longString = "I am the very model of a modern major general. I've information animal, vegitable and mineral...";
        rootEl.innerHTML = `Hello! This text is ellipsified: ${utils.ellipsify(longString)}`;
    }
})
```





![Screenshot of browser inspector and error](img/htmlScript_simpleError.jpg)

## Fixing the Example - UtilityFunctions

Instead, if we can define functions with everything needed for it to run within, we can pass it to the browser through `utilityFunctions`.

Every function passed within that object will be available on the Browser / Client side.


```javascript
utils.ijs.htmlScript({
    height: 200,
    utilityFunctions: ({ 
        message: () => 'Hello!',
        ellipsify: utils.format.ellipsify
    }),
    onReady: ({ rootEl, utilityFunctions }) => {
        longString = "I am the very model of a modern major general. I've information animal, vegitable and mineral...";
        rootEl.innerHTML = `${utilityFunctions.message()} - This text is ellipsified: ${utilityFunctions.ellipsify(longString, 10)}`;
    }
})
```



![Screenshot of utility functions to save the day](img/htmlScript_utilityFunctions.jpg)

## Fixing the Example - Sending Data

What if we need data values?
    
Not to worry, use the `data` parameter.

You can then accept the JavaScript version of that variable in the `onReady` function
and continue right where you left off.


```javascript
nodeMessage = 'Hello from NodeJS!';

utils.ijs.htmlScript({
    height: 200,
    data: ({ message: nodeMessage }),
    utilityFunctions: ({ 
        ellipsify: utils.format.ellipsify
    }),
    onReady: ({ rootEl, utilityFunctions, data }) => {
        longString = "I am the very model of a modern major general. I've information animal, vegitable and mineral...";
        rootEl.innerHTML = `${data.message} - This text is ellipsified: ${utilityFunctions.ellipsify(longString, 10)}`;
    }
})
```




![Screenshot with data](img/htmlScript_data.jpg)

## Advanced Examples

HTML Script is then used underneath the sheets for a couple other features.

For example: Leaflet


```javascript
//-- nodeJS Variable
airportData = { ohareORD: { lat: 41.975813, lon: -87.909428, title: "O'Hare Intl Airport" } };
//-- render out html
utils.ijs.htmlScript({
    scripts: ['https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
              'https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js'],
    css: ['https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'],
    data: airportData,
    height: 150,
    //-- function will be executed in javaScript
    onReady: ({rootEl, data}) => {
        // L is globally available from the leaflet.js script.
        
        //-- capture the nodeJS data and use in JavaScript. Neat!
        ohareORD = data.ohareORD;

        map = L.map(rootEl);
        map.setView([ohareORD.lat, ohareORD.lon], 14);
        
        new L.marker([ohareORD.lat, ohareORD.lon]).bindPopup(ohareORD.title).addTo(map);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
});
```



![Screenshot of Leaflet](img/htmlScript_leaflet.png)

## Many Possibilities

Using HTMLScript, it became possible to run embedded Vega or Vega Lite for interactivity:
(Like with interactive sliders to understand the data)


```javascript
vegaSpec = {
  //-- spec from the example
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Drag the sliders to highlight points.",
  "data": {"url": "https://vega.github.io/vega-lite/examples/data/cars.json"},
  "transform": [{"calculate": "year(datum.Year)", "as": "Year"}],
  "layer": [{
    "params": [{
      "name": "CylYr",
      "value": [{"Cylinders": 4, "Year": 1977}],
      "select": {"type": "point", "fields": ["Cylinders", "Year"]},
      "bind": {
        "Cylinders": {"input": "range", "min": 3, "max": 8, "step": 1},
        "Year": {"input": "range", "min": 1969, "max": 1981, "step": 1}
      }
    }],
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
      "color": {
        "condition": {"param": "CylYr", "field": "Origin", "type": "nominal"},
        "value": "grey"
      }
    }
  }, {
    "transform": [{"filter": {"param": "CylYr"}}],
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
      "color": {"field": "Origin", "type": "nominal"},
      "size": {"value": 100}
    }
  }]
};
utils.vega.embedFromSpec(vegaSpec);
```


![Screenshot of sliders with Vega Lite](img/vegaLiteSliders.png)

We would love to hear which libraries have been helpful for you, and pull requests are welcome.

# Exploring onReady

The `onReady` function has a number of values sent to it,
and they are sent by a single object that can be destructured
for easier use.

* `rootEl` - an Html Div Element made special for this render that you can append to and modify
* `data` - this is the serialized data passed in the `options` to htmlScript - as a simple bridge to pass NodeJS values to your function
* `scripts` - array of javaScript files loaded serially before onReady is called
* `css` - array of css files to load
* `html` - string of html to render within the `rootEl` element, such as `<svg />` - that could be accessed as rootEl.firstChild for d3
* `width` - the css style width to apply to the root div
* `height`- the css style height to apply to the root div
* `debug` - boolean on whether to include a `debugger` within `onReady` to troubleshoot your javascript code.
* `console` - boolean on whether to include console statements at the start and end of onReady - to identify if javaScript silently failed.

Here is an example with `d3` that uses most of these attributes:


```javascript
//-- load the data, to allow the example to work everywhere.
utils.ijs.await(async($$,console) => {
    nigeriaPopulation = await utils.datasets.fetchJSON('https://raw.githubusercontent.com/iamspruce/intro-d3/main/data/nigeria-states.json');
    console.log('nigeria data loaded');
});
```

    nigeria data loaded



```javascript
utils.ijs.htmlScript({
scripts: ['https://cdnjs.cloudflare.com/ajax/libs/d3/6.7.0/d3.min.js'],
height: '100%',
html: '<svg />',
data: nigeriaPopulation,
onReady: ({rootEl, data, options}) => {
    console.log('d3 loaded' + (typeof d3));
    
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 55, left: 70 },
        width = document.querySelector("body").clientWidth,
        height = 800;

    const svg = d3.select(rootEl.firstChild).attr(
        "viewBox",
        [0, 0, width, height]
    );

    // add title
    svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top + 2)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("text-decoration", "underline")
        .text("Nigeria States Population");

    const x_scale = d3
        .scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    let x_axis = d3.axisBottom(x_scale);

    let y_axis = d3.axisLeft(y_scale);
    data.forEach((d) => (d.Population = +d.info.Population));

    // Scale the range of the data in the domains
    x_scale.domain(data.map((d) => d.Name));
    y_scale.domain([0, d3.max(data, (d) => d.Population)]);

    // append the rectangles for the bar chart
    svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x_scale(d.Name))
        .attr("y", (d) => y_scale(d.Population))
        .attr("width", x_scale.bandwidth())
        .attr("height", (d) => height - margin.bottom - y_scale(d.Population));

    // append x axis
    svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(x_axis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // add y axis
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(y_axis);
}});
```



![Screenshot of D3 within Jupyter](img/htmlScriptD3.png)

# Animations

Working with Animations is fairly simple with htmlScript.

All that is then needed is to call `animation(yourFunction)`, and `yourFunction()` will get called each [animationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) so you can animate.

## Simple Example

For a simple example, we can just use htmlScript to render out a rectangle in HTML.


```javascript
//-- lets tell this box to animate
utils.ijs.htmlScript({
    //-- automatically include a debugger statement
    debug: true,

    //-- initialize the root element with the following html
    html: '<div style="width:50px; height: 50px; background-color: black; "/>',
    
    //-- size of the cell output size / html body (inner elements still need to be sized)
    width: 400,
    height: 300,
    
    //-- size of the cell output size / html body (inner elements still need to be sized)
    width: 400,
    height: 400,
    
    //-- nodeJS functions we want to make available to JavaScript
    utilityFunctions: {},
    
    //-- data from nodeJS encoded to be available in JavaScript
    data: {},
    
    //-- called when all scripts are loaded, and the html element is ready
    onReady: ({
        //-- the root element specific for this rendering
        rootEl
    }) => {
        console.log('The Black Box has ARRIVED!');
    }
});
```



## Add in some Data

Let's make the animation configurable by passing in the starting x and y coordinates, and how long the animation should take.

```
    //-- data from nodeJS encoded and available to onReady
    data: {
        centerpointX: 200,
        centerpointY: 200,
        radius: 100 + 50,
        animationDuration: 10000 // milliseconds
    },
```

## Add in Utility Functions

We want to have a number go between 0 to 1 every 10 seconds or so, so we use the [utils.format.timePeriodPercent](https://jupyter-ijavascript-utils.onrender.com/module-format.html#.timePeriodPercent)

```
    //-- nodeJS functions we want to make available to JavaScript
    utilityFunctions: ({
        //-- (numberOfMilliseconds) => {Number} - Percentage from 0 to 1 every number of milliseconds
        //-- https://jupyter-ijavascript-utils.onrender.com/module-format.html#.timePeriodPercent
        timePeriod: (millisecondPeriod) => {
            const currentTime = Date.now();
            return (currentTime % millisecondPeriod) / millisecondPeriod;
        },
        //-- or we could simply leverage the library function that does the same thing
        timePeriod2: utils.format.timePeriodPercent
    }),
```

Even though `utilityFunctions.timePeriod` is defined in Node, we a translated function will now be available in JavaScript.


```javascript
utils.ijs.htmlScript({
    //-- automatically include a debugger statement
    debug: true,

    //-- initialize the root element with the following html
    html: '<div id="my-box" style="width:50px; height: 50px; background-color: black; position: absolute; left: 0px; right: 0px;"/>',
    
    //-- size of the cell output size / html body (inner elements still need to be sized)
    width: 400,
    height: 400,
    
    //-- nodeJS functions we want to make available to JavaScript
    utilityFunctions: ({
        //-- (numberOfMilliseconds) => {Number} - Percentage from 0 to 1 every number of milliseconds
        //-- https://jupyter-ijavascript-utils.onrender.com/module-format.html#.timePeriodPercent
        timePeriod: (millisecondPeriod) => {
            const currentTime = Date.now();
            return (currentTime % millisecondPeriod) / millisecondPeriod;
        },
        //-- or we could simply leverage the library function that does the same thing
        timePeriod2: utils.format.timePeriodPercent
    }),
    
    //-- data from nodeJS encoded and available to onReady
    data: {
        centerPointX: 200,
        centerPointY: 200,
        radius: 100 + 50,
        animationDuration: 10000 // milliseconds
    },
    
    //-- called when all scripts are loaded, and the html element is ready
    onReady: ({
        //-- the root element specific for this rendering
        rootEl,
        //-- the utilityFunctions parameter - nodeJS functions available in JavaScript
        utilityFunctions: lib,
        //-- the data parameter
        data,
        //-- an function that will render on the next animation frame
        animate
    }) => {
        
        const PI2 = Math.PI + Math.PI;
        
        const boxEl = rootEl.querySelector('div#my-box');
        
        const draw = () => {
            const animationPct = lib.timePeriod(data.animationDuration);
            
            //-- position the box by circling around x1 and y1
            const newX = data.centerPointX + Math.cos(animationPct * PI2) * data.radius;
            const newY = data.centerPointY + Math.sin(animationPct * PI2) * data.radius;
            
            boxEl.style.left = `${newX}px`;
            boxEl.style.top = `${newY}px`;
            
            //-- calls the frame again on next animation frame
            animate(draw);
        }
        
        //-- tell it to draw the first frame
        draw();
    }
})
```



![circle animation](img/htmlScript_circleAnimation.gif)

# Extending HtmlScript

Since `onReady` is serialized and sent to JavaScript,
you can send nodejs code, and it will execute in JavaScript.

This can make things tricky when trying to extend it multiple times.

In this case, the `onReady` function can also be passed as a string definition of the function (serialized).

This means you can even extend a function leveraging HtmlScript to do even more specific things.

For example, have one method to [render out a Leaflet Map](https://jupyter-ijavascript-utils.onrender.com/module-leaflet.html#.render).

Then write another function that just [takes lat/lon pairs as an array to just render out markers and bypass the fluff](https://jupyter-ijavascript-utils.onrender.com/module-leaflet.html#.render)

                                                                                                                        

# Considerations:

## Only onReady and utilityFunctions are available in JavaScript

Please remember that only the content of the functions in `utilityFunctions` and `onReady` are available in JavaScript.

For example, this will fail because the `utils` nodeJS variable is referenced

![Screenshot of browser inspector and error](img/htmlScript_simpleError.jpg)

We can fix it by using `utilityFunctions` to pass the function definition

![Screenshot of utility functions to save the day](img/htmlScript_utilityFunctions.jpg)

Or by using the `data` attribute to pass data.

![Screenshot with data](img/htmlScript_data.jpg)

[See the Simple Failure Example for more](#Simple-Failure-Example)

## Order of the Scripts Loaded

Note that Jupyter performs DOM manipulation when executing cells.

Browsers can differ, but most modern browsers (such as chrome and firefox)
will behave differently than simply rendering html from a page load.

* `<script />` tags are no longer loaded in sequenc
  * (This means that if you load `scriptA` and `scriptB`, then `scriptB` cannot assume `scriptA` has loaded first, making dependent libraries unable to work)
* Inline `<script />` tags can also not guarantee the scripts have finished loading.

By using `htmlScript` options.scripts: [], the order the scripts are specified is the order the scripts are loaded.

You can now safely use dependent libraries, and assume `scriptA` has finished loading before `scriptB` is executed. Same for inline scripts.

## Always Load Scripts if an HtmlScript Depends on it

It seems as though the scripts within Jupyter cells are not isolated,
so you could technically load a script once,
and then run the next htmlScript without loading the script.

However, this is not recommended because you would have no guarantee that the library has finished loading before the following cells are executed.

