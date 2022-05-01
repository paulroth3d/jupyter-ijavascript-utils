**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/ex_NoiseVisualization.ipynb) / [Alternate Export Version](notebooks/ex_NoiseVisualizationExport.ipynb)**

# Perlin / Simplex Noise Visualization

Here we'll try to understand what [Perlin Noise](https://en.wikipedia.org/wiki/Perlin_noise)
and the newer [Simplex Noise](https://en.wikipedia.org/wiki/Simplex_noise).

For further detail on the mathematics, I would suggest:
* [Adrian B: Understanding Perlin Noise](https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)
* [Stefan Gustavson's Paper: Understanding Simplex Noise](https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)
* [Jasper Flick's writeups on PseudoRandom Noise](https://catlikecoding.com/unity/tutorials/pseudorandom-noise/simplex-noise/)

Both Simplex and Perlin noise are pseudo-random functions that provide a [-1, 1] range values.

(Ultimately the values appear random, but because it is deterministic - if you provide the same input values, you'll get the same values back - it isn't really random)

Simplex provides values at higher dimensions much more easily: `O(N^2)`, and provides a smoother gradient among values.

![Screenshot of chart](img/noiseVisualization_dotChart.svg)

In this document, we'll be showing the values as they change along the z-axis in an animation, as we move along it based on a function of time - receiving some value between -1 and +1.

fn(x, y, time) => []-1 ... 1]

![Screenshot of Chart](img/noiseAxis.png)

So instead of creating static noise values, we can animate.

![Screenshot of animation for 1d](img/noise1d.gif)

This is made a bit clearer if we put a 'spin' where counter clockwise / red is negative, and clock-wise / green is positive values - shown on a 2d grid as we move up and down the z-plane.

![Screenshot of animation for 2d](img/noise2d.gif)

Playing around with these values, you can create some very simple but elegant graphics.

![Screenshot of the light animation](img/svgAnimation2Light.gif)

[See here for a full screen demo](https://paulroth3d.github.io/drift)

# Libraries Used

Note that we use one additional library for simplex noise:

If using NodeJS, there are a few options:

* [simplex-noise](https://www.npmjs.com/package/simplex-noise)
* [noisejs](https://www.npmjs.com/package/noisejs)
                                         
(This was used mostly in generating the SVGs, and simply converting from `embed` to `render` ... and removing the calls to `window`)

```javascript
utils = require('jupyter-ijavascript-utils')
NoiseJS = require('noisejs').Noise;
noise = new NoiseJS();
['utils', 'noise']
```

    [ 'utils', 'noise' ]

# Start / Stop the Animation

As with any animation, it is important to have an ability to stop if unexpected things happen while playing around.

The animation will stop if `window.stopAnimation` is true.

Executing this cell will tell the animation to restart.

(This is helpful if `cancelAnimationFrame` isn't supported: see https://caniuse.com/?search=animationFrame)

```javascript
//-- it is always useful to have some means of stopping animations when exploring

utils.ijs.htmlScript({
    width: 10, height: 10,
    utilityFunctions: { ...utils.svg.utilityFunctions },
    onReady: () => {        
        if (window.stopAnimation !== undefined) {
            console.log('restarting animation');
            window.stopAnimation = true;
            window.setTimeout(() => {
                console.log('allowing animation again');
                window.stopAnimation = false;
            }, 500);            
        }
    }
});

//-- an alternative option was made available through:
//-- https://jupyter-ijavascript-utils.onrender.com/module-svg_utilityFunctions.html
/*
utils.ijs.htmlScript({
    
    //-- pack the nodejs functions we want available client side / within javascript
    utilityFunctions: { ...utils.svg.utilityFunctions },
    
    //-- accept them onReady - see ijs/htmlScript
    onReady: ({ utilityFunctions }) => {
        const animation = utilityFunctions.animationFrameCalls();
        animation.resetAllAnimations();
     }
})
*/
```

<html><body>
  <div uuid="213ef6e0-75c9-4c98-9a7c-b317492653f2" style="width:10px; height: 10px"></div>
  <div scriptUUID="213ef6e0-75c9-4c98-9a7c-b317492653f2" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('213ef6e0-75c9-4c98-9a7c-b317492653f2', {
      scriptIndex: -1,
      scriptsToLoad: [],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        const rootEl = document.querySelector('div[uuid="213ef6e0-75c9-4c98-9a7c-b317492653f2"]');

        const options = {
          uuid: '213ef6e0-75c9-4c98-9a7c-b317492653f2',
          width: '10px',
          height: '10px',
          scripts: [],
          css: [],
        };

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};
        utilityFunctions.animationFrameCalls = function animationFrameCalls() {
  const requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame;

  const cancelAnimationFrame = window.cancelAnimationFrame
      || window.mozCancelAnimationFrame;

  const stopOtherAnimations = () => {
    if (window.animation) {
      cancelAnimationFrame(window.animation);
      window.animation = null;
    }
  };

  const resetAllAnimations = () => {
    window.stopAnimation = true;
    window.setTimeout(() => {
      window.stopAnimation = false;
    }, 500);
  };

  const allowAnimations = (isAllowed = true) => {
    window.stopAnimation = isAllowed;
  };

  const nextAnimationFrame = (fn) => {
    const animationId = requestAnimationFrame(fn);
    window.animation = animationId;
  };

  const checkAnimationsAllowed = () => {
    if (window.stopAnimation) {
      console.log('stopping the animation');
      return (false);
    }
    return true;
  };

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    stopOtherAnimations,
    nextAnimationFrame,
    checkAnimationsAllowed,
    resetAllAnimations,
    allowAnimations
  };
};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        (() => {        
        if (window.stopAnimation !== undefined) {
            console.log('restarting animation');
            window.stopAnimation = true;
            window.setTimeout(() => {
                console.log('allowing animation again');
                window.stopAnimation = false;
            }, 500);            
        }
    })({rootEl, data, utilityFunctions, options})
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

    externalScriptLoaded('213ef6e0-75c9-4c98-9a7c-b317492653f2');
  </script>

</body></html>

# Perlin vs Simplex Noise

Perlin Noise was made by Ken Perlin for the Movie `Tron` to produce more natural feeling computer generated textures.

Simplex Noise is similar to Perlin Noise, but with the following consequences:

* lower computational complexity and requires fewer multiplications
* scales to higher dimensions (4D, 5D) with much less computational cost: {\displaystyle O(n^{2})}O(n^{2})
* no noticeable directional artifacts
  * (although 2d view of 3d noise looks more jagged; getting more jagged with higher dimensions)
* a well-defined and continuous gradient (almost) everywhere
* easy to implement in hardware
                                                                           
For our case we'll be using the `Simplex` version of noise

## Understanding the data

Lets show the values based on how much it fluctuates.

(Here we create a table, executing a function for every row and column, and generate a noise2d value)

```javascript
{
    const numColumns = 20;
    const numRows = 20;
    const scale = 0.05;
    
    const colorRange = new utils.svg.svgJS.Color('#F00').to('#0F0');
    
    new utils.TableGenerator(
        utils.array.size(numRows, (yIndex) => 
            utils.array.size(numColumns, (xIndex) => 
                noise.simplex2(xIndex * scale, yIndex * scale)))
        .reverse()
    )
    .styleCell(({ value }) => `color: ${colorRange.at( value / 2 + 0.5 ).toHex()}`)
    .render();
}
```

<table >
<tr >
	<th>0</th>
	<th>1</th>
	<th>2</th>
	<th>3</th>
	<th>4</th>
	<th>5</th>
	<th>6</th>
	<th>7</th>
	<th>8</th>
	<th>9</th>
	<th>10</th>
	<th>11</th>
	<th>12</th>
	<th>13</th>
	<th>14</th>
	<th>15</th>
	<th>16</th>
	<th>17</th>
	<th>18</th>
	<th>19</th>
</tr>
<tr >
	<td style="color: #b64900">-0.424</td>
	<td style="color: #b04f00">-0.382</td>
	<td style="color: #ac5300">-0.345</td>
	<td style="color: #a75800">-0.31</td>
	<td style="color: #a25d00">-0.272</td>
	<td style="color: #9c6300">-0.225</td>
	<td style="color: #956a00">-0.168</td>
	<td style="color: #8c7300">-0.1</td>
	<td style="color: #827d00">-0.021</td>
	<td style="color: #778800">0.064</td>
	<td style="color: #6c9300">0.15</td>
	<td style="color: #639c00">0.222</td>
	<td style="color: #5ea100">0.261</td>
	<td style="color: #609f00">0.251</td>
	<td style="color: #689700">0.185</td>
	<td style="color: #768900">0.072</td>
	<td style="color: #887700">-0.068</td>
	<td style="color: #9a6500">-0.205</td>
	<td style="color: #a75800">-0.313</td>
	<td style="color: #ae5100">-0.366</td>
</tr>
<tr >
	<td style="color: #a85700">-0.316</td>
	<td style="color: #a25d00">-0.273</td>
	<td style="color: #9d6200">-0.229</td>
	<td style="color: #976800">-0.181</td>
	<td style="color: #8f7000">-0.125</td>
	<td style="color: #877800">-0.059</td>
	<td style="color: #7d8200">0.017</td>
	<td style="color: #728d00">0.102</td>
	<td style="color: #679800">0.192</td>
	<td style="color: #5ca300">0.281</td>
	<td style="color: #51ae00">0.361</td>
	<td style="color: #49b600">0.424</td>
	<td style="color: #46b900">0.453</td>
	<td style="color: #48b700">0.434</td>
	<td style="color: #52ad00">0.361</td>
	<td style="color: #619e00">0.241</td>
	<td style="color: #738c00">0.095</td>
	<td style="color: #867900">-0.051</td>
	<td style="color: #956a00">-0.171</td>
	<td style="color: #9f6000">-0.244</td>
</tr>
<tr >
	<td style="color: #976800">-0.181</td>
	<td style="color: #926d00">-0.147</td>
	<td style="color: #8d7200">-0.105</td>
	<td style="color: #867900">-0.054</td>
	<td style="color: #7e8100">0.009</td>
	<td style="color: #758a00">0.084</td>
	<td style="color: #6a9500">0.169</td>
	<td style="color: #5ea100">0.261</td>
	<td style="color: #52ad00">0.354</td>
	<td style="color: #47b800">0.441</td>
	<td style="color: #3ec100">0.514</td>
	<td style="color: #38c700">0.564</td>
	<td style="color: #35ca00">0.583</td>
	<td style="color: #38c700">0.557</td>
	<td style="color: #42bd00">0.483</td>
	<td style="color: #51ae00">0.367</td>
	<td style="color: #639c00">0.226</td>
	<td style="color: #758a00">0.083</td>
	<td style="color: #857a00">-0.04</td>
	<td style="color: #8f7000">-0.123</td>
</tr>
<tr >
	<td style="color: #837c00">-0.031</td>
	<td style="color: #817e00">-0.015</td>
	<td style="color: #7e8100">0.012</td>
	<td style="color: #798600">0.053</td>
	<td style="color: #728d00">0.11</td>
	<td style="color: #689700">0.181</td>
	<td style="color: #5ea100">0.263</td>
	<td style="color: #53ac00">0.352</td>
	<td style="color: #47b800">0.44</td>
	<td style="color: #3dc200">0.519</td>
	<td style="color: #35ca00">0.581</td>
	<td style="color: #31ce00">0.619</td>
	<td style="color: #2fd000">0.628</td>
	<td style="color: #33cc00">0.601</td>
	<td style="color: #3bc400">0.534</td>
	<td style="color: #48b700">0.432</td>
	<td style="color: #58a700">0.308</td>
	<td style="color: #699600">0.178</td>
	<td style="color: #778800">0.063</td>
	<td style="color: #827d00">-0.017</td>
</tr>
<tr >
	<td style="color: #708f00">0.119</td>
	<td style="color: #728d00">0.109</td>
	<td style="color: #718e00">0.112</td>
	<td style="color: #6f9000">0.131</td>
	<td style="color: #6a9500">0.168</td>
	<td style="color: #639c00">0.222</td>
	<td style="color: #5ba400">0.29</td>
	<td style="color: #51ae00">0.365</td>
	<td style="color: #47b800">0.44</td>
	<td style="color: #3fc000">0.506</td>
	<td style="color: #39c600">0.556</td>
	<td style="color: #35ca00">0.585</td>
	<td style="color: #35ca00">0.587</td>
	<td style="color: #38c700">0.563</td>
	<td style="color: #3fc000">0.51</td>
	<td style="color: #49b600">0.43</td>
	<td style="color: #55aa00">0.33</td>
	<td style="color: #639c00">0.223</td>
	<td style="color: #6f9000">0.129</td>
	<td style="color: #778800">0.066</td>
</tr>
<tr >
	<td style="color: #5fa000">0.253</td>
	<td style="color: #649b00">0.216</td>
	<td style="color: #679800">0.189</td>
	<td style="color: #699600">0.178</td>
	<td style="color: #689700">0.186</td>
	<td style="color: #649b00">0.213</td>
	<td style="color: #5fa000">0.255</td>
	<td style="color: #58a700">0.308</td>
	<td style="color: #51ae00">0.364</td>
	<td style="color: #4bb400">0.414</td>
	<td style="color: #46b900">0.452</td>
	<td style="color: #43bc00">0.472</td>
	<td style="color: #43bc00">0.473</td>
	<td style="color: #46b900">0.454</td>
	<td style="color: #4ab500">0.417</td>
	<td style="color: #52ad00">0.36</td>
	<td style="color: #5ba400">0.289</td>
	<td style="color: #649b00">0.215</td>
	<td style="color: #6c9300">0.152</td>
	<td style="color: #718e00">0.116</td>
</tr>
<tr >
	<td style="color: #52ad00">0.355</td>
	<td style="color: #5aa500">0.292</td>
	<td style="color: #619e00">0.236</td>
	<td style="color: #679800">0.194</td>
	<td style="color: #6a9500">0.17</td>
	<td style="color: #6a9500">0.165</td>
	<td style="color: #699600">0.177</td>
	<td style="color: #669900">0.203</td>
	<td style="color: #619e00">0.236</td>
	<td style="color: #5ea100">0.267</td>
	<td style="color: #5ba400">0.29</td>
	<td style="color: #59a600">0.303</td>
	<td style="color: #59a600">0.303</td>
	<td style="color: #5aa500">0.292</td>
	<td style="color: #5da200">0.269</td>
	<td style="color: #619e00">0.236</td>
	<td style="color: #669900">0.197</td>
	<td style="color: #6b9400">0.158</td>
	<td style="color: #6f9000">0.133</td>
	<td style="color: #6f9000">0.13</td>
</tr>
<tr >
	<td style="color: #4bb400">0.411</td>
	<td style="color: #56a900">0.328</td>
	<td style="color: #609f00">0.247</td>
	<td style="color: #699600">0.178</td>
	<td style="color: #708f00">0.125</td>
	<td style="color: #748b00">0.09</td>
	<td style="color: #768900">0.073</td>
	<td style="color: #778800">0.07</td>
	<td style="color: #768900">0.077</td>
	<td style="color: #748b00">0.086</td>
	<td style="color: #748b00">0.094</td>
	<td style="color: #738c00">0.098</td>
	<td style="color: #738c00">0.098</td>
	<td style="color: #738c00">0.095</td>
	<td style="color: #748b00">0.087</td>
	<td style="color: #768900">0.077</td>
	<td style="color: #778800">0.068</td>
	<td style="color: #778800">0.067</td>
	<td style="color: #768900">0.078</td>
	<td style="color: #728d00">0.109</td>
</tr>
<tr >
	<td style="color: #4ab500">0.419</td>
	<td style="color: #57a800">0.32</td>
	<td style="color: #639c00">0.221</td>
	<td style="color: #6f9000">0.13</td>
	<td style="color: #798600">0.054</td>
	<td style="color: #807f00">-0.004</td>
	<td style="color: #857a00">-0.046</td>
	<td style="color: #897600">-0.073</td>
	<td style="color: #8b7400">-0.091</td>
	<td style="color: #8d7200">-0.104</td>
	<td style="color: #8e7100">-0.113</td>
	<td style="color: #8f7000">-0.118</td>
	<td style="color: #8f7000">-0.118</td>
	<td style="color: #8e7100">-0.114</td>
	<td style="color: #8d7200">-0.105</td>
	<td style="color: #8b7400">-0.092</td>
	<td style="color: #897600">-0.072</td>
	<td style="color: #857a00">-0.042</td>
	<td style="color: #7f8000">0.002</td>
	<td style="color: #788700">0.062</td>
</tr>
<tr >
	<td style="color: #4fb000">0.383</td>
	<td style="color: #5da200">0.273</td>
	<td style="color: #6b9400">0.161</td>
	<td style="color: #788700">0.056</td>
	<td style="color: #847b00">-0.034</td>
	<td style="color: #8d7200">-0.108</td>
	<td style="color: #956a00">-0.166</td>
	<td style="color: #9a6500">-0.212</td>
	<td style="color: #9f6000">-0.25</td>
	<td style="color: #a35c00">-0.282</td>
	<td style="color: #a75800">-0.307</td>
	<td style="color: #a85700">-0.321</td>
	<td style="color: #a85700">-0.321</td>
	<td style="color: #a75800">-0.309</td>
	<td style="color: #a45b00">-0.285</td>
	<td style="color: #9f6000">-0.25</td>
	<td style="color: #9a6500">-0.205</td>
	<td style="color: #926d00">-0.148</td>
	<td style="color: #8a7500">-0.079</td>
	<td style="color: #807f00">-0.001</td>
</tr>
<tr >
	<td style="color: #57a800">0.315</td>
	<td style="color: #669900">0.197</td>
	<td style="color: #768900">0.078</td>
	<td style="color: #847b00">-0.034</td>
	<td style="color: #906f00">-0.131</td>
	<td style="color: #9a6500">-0.212</td>
	<td style="color: #a35c00">-0.278</td>
	<td style="color: #aa5500">-0.333</td>
	<td style="color: #b04f00">-0.383</td>
	<td style="color: #b64900">-0.429</td>
	<td style="color: #bb4400">-0.465</td>
	<td style="color: #bd4200">-0.485</td>
	<td style="color: #be4100">-0.486</td>
	<td style="color: #bb4400">-0.468</td>
	<td style="color: #b64900">-0.431</td>
	<td style="color: #b04f00">-0.378</td>
	<td style="color: #a75800">-0.312</td>
	<td style="color: #9e6100">-0.236</td>
	<td style="color: #936c00">-0.152</td>
	<td style="color: #887700">-0.065</td>
</tr>
<tr >
	<td style="color: #629d00">0.229</td>
	<td style="color: #728d00">0.107</td>
	<td style="color: #817e00">-0.015</td>
	<td style="color: #906f00">-0.128</td>
	<td style="color: #9c6300">-0.225</td>
	<td style="color: #a75800">-0.306</td>
	<td style="color: #af5000">-0.372</td>
	<td style="color: #b64900">-0.43</td>
	<td style="color: #bd4200">-0.483</td>
	<td style="color: #c33c00">-0.531</td>
	<td style="color: #c83700">-0.571</td>
	<td style="color: #cb3400">-0.596</td>
	<td style="color: #cc3300">-0.6</td>
	<td style="color: #c93600">-0.579</td>
	<td style="color: #c43b00">-0.535</td>
	<td style="color: #bb4400">-0.471</td>
	<td style="color: #b14e00">-0.391</td>
	<td style="color: #a65900">-0.302</td>
	<td style="color: #9a6500">-0.21</td>
	<td style="color: #8f7000">-0.123</td>
</tr>
<tr >
	<td style="color: #6d9200">0.144</td>
	<td style="color: #7d8200">0.018</td>
	<td style="color: #8d7200">-0.105</td>
	<td style="color: #9b6400">-0.216</td>
	<td style="color: #a75800">-0.31</td>
	<td style="color: #b14e00">-0.385</td>
	<td style="color: #b84700">-0.446</td>
	<td style="color: #bf4000">-0.497</td>
	<td style="color: #c53a00">-0.543</td>
	<td style="color: #ca3500">-0.586</td>
	<td style="color: #cf3000">-0.625</td>
	<td style="color: #d32c00">-0.655</td>
	<td style="color: #d42b00">-0.666</td>
	<td style="color: #d22d00">-0.65</td>
	<td style="color: #cd3200">-0.606</td>
	<td style="color: #c43b00">-0.536</td>
	<td style="color: #b94600">-0.448</td>
	<td style="color: #ac5300">-0.352</td>
	<td style="color: #a05f00">-0.258</td>
	<td style="color: #966900">-0.177</td>
</tr>
<tr >
	<td style="color: #768900">0.074</td>
	<td style="color: #877800">-0.058</td>
	<td style="color: #976800">-0.182</td>
	<td style="color: #a55a00">-0.292</td>
	<td style="color: #b04f00">-0.38</td>
	<td style="color: #b94600">-0.448</td>
	<td style="color: #bf4000">-0.499</td>
	<td style="color: #c43b00">-0.537</td>
	<td style="color: #c83700">-0.57</td>
	<td style="color: #cd3200">-0.604</td>
	<td style="color: #d12e00">-0.643</td>
	<td style="color: #d62900">-0.68</td>
	<td style="color: #d92600">-0.702</td>
	<td style="color: #d82700">-0.697</td>
	<td style="color: #d32c00">-0.657</td>
	<td style="color: #ca3500">-0.587</td>
	<td style="color: #bf4000">-0.495</td>
	<td style="color: #b24d00">-0.396</td>
	<td style="color: #a65900">-0.302</td>
	<td style="color: #9c6300">-0.227</td>
</tr>
<tr >
	<td style="color: #7c8300">0.028</td>
	<td style="color: #8e7100">-0.114</td>
	<td style="color: #9f6000">-0.245</td>
	<td style="color: #ad5200">-0.355</td>
	<td style="color: #b84700">-0.44</td>
	<td style="color: #bf4000">-0.499</td>
	<td style="color: #c43b00">-0.535</td>
	<td style="color: #c63900">-0.557</td>
	<td style="color: #c93600">-0.577</td>
	<td style="color: #cd3200">-0.607</td>
	<td style="color: #d22d00">-0.647</td>
	<td style="color: #d82700">-0.692</td>
	<td style="color: #dc2300">-0.727</td>
	<td style="color: #dd2200">-0.733</td>
	<td style="color: #d92600">-0.701</td>
	<td style="color: #d02f00">-0.632</td>
	<td style="color: #c43b00">-0.538</td>
	<td style="color: #b74800">-0.436</td>
	<td style="color: #ab5400">-0.342</td>
	<td style="color: #a25d00">-0.271</td>
</tr>
<tr >
	<td style="color: #7f8000">0.006</td>
	<td style="color: #936c00">-0.152</td>
	<td style="color: #a55a00">-0.294</td>
	<td style="color: #b44b00">-0.409</td>
	<td style="color: #be4100">-0.492</td>
	<td style="color: #c43b00">-0.541</td>
	<td style="color: #c73800">-0.562</td>
	<td style="color: #c83700">-0.571</td>
	<td style="color: #ca3500">-0.584</td>
	<td style="color: #ce3100">-0.612</td>
	<td style="color: #d32c00">-0.656</td>
	<td style="color: #da2500">-0.708</td>
	<td style="color: #df2000">-0.753</td>
	<td style="color: #e21d00">-0.77</td>
	<td style="color: #de2100">-0.744</td>
	<td style="color: #d62900">-0.676</td>
	<td style="color: #c93600">-0.579</td>
	<td style="color: #bc4300">-0.471</td>
	<td style="color: #af5000">-0.374</td>
	<td style="color: #a65900">-0.305</td>
</tr>
<tr >
	<td style="color: #7f8000">0</td>
	<td style="color: #966900">-0.178</td>
	<td style="color: #aa5500">-0.336</td>
	<td style="color: #ba4500">-0.46</td>
	<td style="color: #c43b00">-0.541</td>
	<td style="color: #c93600">-0.58</td>
	<td style="color: #cb3400">-0.591</td>
	<td style="color: #cb3400">-0.593</td>
	<td style="color: #cc3300">-0.604</td>
	<td style="color: #d02f00">-0.633</td>
	<td style="color: #d62900">-0.68</td>
	<td style="color: #dd2200">-0.737</td>
	<td style="color: #e41b00">-0.788</td>
	<td style="color: #e71800">-0.811</td>
	<td style="color: #e41b00">-0.788</td>
	<td style="color: #db2400">-0.718</td>
	<td style="color: #ce3100">-0.614</td>
	<td style="color: #bf4000">-0.498</td>
	<td style="color: #b24d00">-0.393</td>
	<td style="color: #a85700">-0.318</td>
</tr>
<tr >
	<td style="color: #808000">0</td>
	<td style="color: #996600">-0.198</td>
	<td style="color: #af5000">-0.372</td>
	<td style="color: #c03f00">-0.504</td>
	<td style="color: #ca3500">-0.584</td>
	<td style="color: #ce3100">-0.619</td>
	<td style="color: #cf3000">-0.627</td>
	<td style="color: #d02f00">-0.629</td>
	<td style="color: #d12e00">-0.642</td>
	<td style="color: #d52a00">-0.673</td>
	<td style="color: #dc2300">-0.723</td>
	<td style="color: #e31c00">-0.781</td>
	<td style="color: #ea1500">-0.832</td>
	<td style="color: #ec1300">-0.854</td>
	<td style="color: #e91600">-0.829</td>
	<td style="color: #df2000">-0.753</td>
	<td style="color: #d12e00">-0.638</td>
	<td style="color: #c03f00">-0.509</td>
	<td style="color: #b14e00">-0.39</td>
	<td style="color: #a65900">-0.303</td>
</tr>
<tr >
	<td style="color: #808000">0</td>
	<td style="color: #9a6500">-0.21</td>
	<td style="color: #b24d00">-0.395</td>
	<td style="color: #c43b00">-0.535</td>
	<td style="color: #ce3100">-0.618</td>
	<td style="color: #d32c00">-0.655</td>
	<td style="color: #d52a00">-0.668</td>
	<td style="color: #d62900">-0.676</td>
	<td style="color: #d82700">-0.694</td>
	<td style="color: #dc2300">-0.729</td>
	<td style="color: #e31c00">-0.779</td>
	<td style="color: #ea1500">-0.834</td>
	<td style="color: #f00f00">-0.879</td>
	<td style="color: #f10e00">-0.893</td>
	<td style="color: #ed1200">-0.858</td>
	<td style="color: #e21d00">-0.77</td>
	<td style="color: #d12e00">-0.641</td>
	<td style="color: #bf4000">-0.494</td>
	<td style="color: #ad5200">-0.356</td>
	<td style="color: #9f6000">-0.25</td>
</tr>
<tr >
	<td style="color: #808000">0</td>
	<td style="color: #9b6400">-0.214</td>
	<td style="color: #b34c00">-0.404</td>
	<td style="color: #c53a00">-0.546</td>
	<td style="color: #d02f00">-0.635</td>
	<td style="color: #d62900">-0.681</td>
	<td style="color: #d92600">-0.704</td>
	<td style="color: #dc2300">-0.722</td>
	<td style="color: #df2000">-0.748</td>
	<td style="color: #e41b00">-0.786</td>
	<td style="color: #ea1500">-0.834</td>
	<td style="color: #f00f00">-0.883</td>
	<td style="color: #f40b00">-0.916</td>
	<td style="color: #f40b00">-0.915</td>
	<td style="color: #ee1100">-0.863</td>
	<td style="color: #e01f00">-0.757</td>
	<td style="color: #cd3200">-0.609</td>
	<td style="color: #b84700">-0.442</td>
	<td style="color: #a45b00">-0.283</td>
	<td style="color: #936c00">-0.154</td>
</tr>
</table>

## Showing with a Visual Graph

Here is the same data shown as a graph - with values as the size of the circle

```javascript
{
    const numColumns = 20;
    const numRows = 20;
    const scale = 0.05;
    utils.vega.svg((vl) => vl.markPoint({shape: 'circle', filled: true})
      .data(
        utils.array.size(numRows, (yIndex) => 
            utils.array.size(numColumns, (xIndex) => ({x: xIndex * scale, y: yIndex * scale, val: noise.simplex2(xIndex * scale, yIndex * scale) }))
        ).flat()
      )
      .width(400).height(400)
      .encode(
        vl.x().fieldQ('x'),
        vl.y().fieldQ('y'),
        vl.color().fieldQ('val').legend(null).scale({"range": ["#F00", "#0F0"]}),
        //vl.color().fieldQ('val').legend(null).scale({scheme: 'rainbow'}),
        //vl.angle().fieldQ('val').legend(null), //.scale({domain: [0, 360], range: [-1, 1] })
        vl.size().fieldQ('val').legend(null)
      )
      //.background('black')
    )
}
```

![svg](img/noiseVisualization_dotChart.svg)

## Looking at the Gradient

Notice that following each of the axes, [there is a clear and defined gradient](https://betterexplained.com/articles/vector-calculus-understanding-the-gradient/) so that the line appears to have a smooth velocity applied - avoiding `jerk` or `jaggedness`.

```javascript
generateNoise = (index, inc, xOffset = 0, yOffset = 0, zOffset = 0) => {
    const val = index * inc;
    
    return ({
        index,
        xAmt: noise.simplex3(xOffset + val, yOffset, zOffset),
        yAmt: noise.simplex3(xOffset, yOffset + val, zOffset),
        zAmt: noise.simplex3(xOffset, yOffset, zOffset + val)
    });
}

len = 30;
amt = .1;

utils.vega.svgFromSpec({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": {
    values: utils.array.size(len, (index) => generateNoise(index, amt))
  },
  "repeat": {
    "layer": ["xAmt", "yAmt", "zAmt"]
  },
  "spec": {
    "mark": "line",
    "encoding": {
      "x": {
        "field": "index",
        "type": "quantitative"
      },
      "y": {
        "field": {"repeat": "layer"},
        "type": "quantitative",
        "title": "Value from Noise"
      },
      "color": {
        "datum": {"repeat": "layer"},
        "type": "nominal"
      }
    }
  }
})
```

![svg](img/noiseVisualization_axisChart.svg)

# Animating to show the value

Moving along the Z-Axis, we can show how these values play over time.

In our case, we'll always have the screen corners be between 0-1 at each of the corners.

We'll call 'density' the number of pixels between each of the indicators.

The number of points will still be evenly distributed based on the number of pixels betwen 'indicators'

![Screenshot of animation for 1d](../img/noise1d.gif)

[Link to animation](https://paulroth3d.github.io/drift/v6/?offset=0&width=30&density=20&initial=F00&final=0F0&min=1&max=1&period=7000)

# Animation showing the value

Lets try using the current time to calculate two random values:

* direction of the arrow
* length of the arrow

Note that the svg.render uses `ijs.htmlScript` as its basis,
so we can parameterize the data used in the call within the `data` option.

Also, the functions are written in node (executed in the Jupyter Lab),
but are executed in JavaScript.

Both the `data` provided, and functions provided on the `utilityFunctions` are available within the `onReady` call:

* el - the html element generated for the output already primed for SVG.js
* SVG - the SVG.js library - to support additional matrices, color ranges, etc.
* data - the data object provided to node
* utilityFunctions - the utilityFunctions provided to node
* width - the width provided to the options
* height - the height provided to the options

```javascript
utils.svg.embed({
    debug: false,
    
    //-- width of the SVG Scene
    width: 720,
    //-- height of the SVG Scene
    height: 360,
    data: {
        //-- number of indicators along x and y axis
        xCount: 48,
        yCount: 24,
        //-- background color
        backgroundColor: '#FFF',
        //-- color range: 0: startingColor, 1: ending color
        initialColor: '#F0F',
        finalColor: '#0FF',
        //-- how fast or slow the period resets, simplex provides 1 cycle per period
        timePeriod: 10000,
        //-- how closely related the direction and length are in time
        timeOffset: 5000,
        //-- the minimum / maximum lengths of the indicators
        minLength: 10,
        maxLength: 50,
        //-- opacity and width of line
        width: 4,
        opacity: 0.2,
        //-- sensitivity [0 - 1]
        directionSensitivity: 0.8,
        lengthSensitivity: 0.4,
    },

    //-- include the perlin noise library in javascript
    scripts: ['https://cdn.rawgit.com/josephg/noisejs/master/perlin.js'],

    //-- accept the arguments we want passed
    //-- el: html element already setup for SVG.js
    //-- SVG: the SVG.js library (used for ColorRanges, etc.)
    //-- data: the data object above from NodeJS - now in JavaScript
    //-- utilityFunctions: the functions passed from NodeJS - now in JavaScript
    //-- the width and height sent
    //-- see utils.svg.embed for more:
    //-- https://jupyter-ijavascript-utils.onrender.com/module-svg.html
    onReady: ({ el, SVG, data, height, width, utilityFunctions: lib }) => {
        
        //-- make the background black
        el.node.setAttribute('style', `background-color: ${data.backgroundColor}`);
        
        const xCount = data.xCount;
        const yCount = data.yCount;
        
        const xRangeInc = 1 / xCount;
        const yRangeInc = 1 / yCount;
        
        const xInc = width / xCount;
        const yInc = height / yCount;
        
        const xMid = width / 2;
        const yMid = height / 2;
        
        const PI2 = Math.PI * 2;
        // const noiseRange = [-1, 1];
        
        const colorRange = new SVG.Color(data.initialColor).to(data.finalColor);
        
        const directionRange = [-data.directionSensitivity, data.directionSensitivity];
        const lengthRange = [-data.lengthSensitivity, data.lengthSensitivity];
        
        //-- initialize lines
        const lines = lib.size(yCount)
            .map(() => lib.size(xCount, () => el.line()));
        
        const [ requestAnimationFrame, cancelAnimationFrame ] = lib.animationFrameCalls();
        
        //-- note that cancel is not supported in all cases
        //-- see https://caniuse.com/?search=animationFrame
        //-- and manual stop below
        
        if (window.currentAnimation) {
            cancelAnimationFrame(window.currentAnimation);
            window.currentAnimation = null;
        }
        
        const renderLines = () => {
            //-- render line
            let zDir = lib.mapTime(new Date().getTime(), data.timePeriod);
            let zLen = lib.mapTime(new Date().getTime() + data.timeOffset, data.timePeriod);
            lines.forEach((row, rowIndex) => {
                row.forEach((line, colIndex) => {
                    const valDir = noise.simplex3(colIndex * xRangeInc, rowIndex * yRangeInc, zDir);
                    const dir = lib.mapDomain(valDir, directionRange, [0, PI2]);

                    const valLen = noise.simplex3(colIndex * xRangeInc, rowIndex * yRangeInc, zLen);
                    const len = lib.mapDomain(valLen, lengthRange, [data.minLength, data.maxLength]);
                    const colorC = lib.mapDomain(valLen, lengthRange, [0, 1]);

                    lib.plotLine(line, xInc, yInc, colIndex, rowIndex, dir, len);
                    lib.styleLine(line, colorRange, colorC, data.width, data.opacity);
                })
            });
            
            //-- stop the animation
            if (window.stopAnimation == true) {
                console.log('stopping animation');
                window.currentAnimation = null;
            } else {
                window.currentAnimation = window.requestAnimationFrame(renderLines);
            }
        };
        renderLines();
    },
    utilityFunctions: {
        plotLine:(line, xInc, yInc, x, y, dir, mag) => {
            const xOff = xInc * x;
            const yOff = yInc * y;
            line.plot(
                xOff,
                yOff,
                xOff + Math.cos(dir) * mag,
                yOff + Math.sin(dir) * mag
            )
        },
        styleLine: (line, colorRange, c, width = 1, opacity = 1) => {
            line.stroke({
                color: colorRange.at(c).toHex(),
                width,
                opacity,
                linecap: 'round'
            });
        },
        //-- see svg/utilityFunctions.animationFrameCalls
        animationFrameCalls: () => {
            const requestAnimationFrame = window.requestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.msRequestAnimationFrame;
            const cancelAnimationFrame = window.cancelAnimationFrame
                || window.mozCancelAnimationFrame;
            
            return [requestAnimationFrame, cancelAnimationFrame];
        },
        //-- see array.size as an alternative, and simply import it instead
        size: function size(length, defaultValue) {
          if (typeof defaultValue === 'function') {
            return new Array(length).fill(null).map((_, index) => defaultValue(index));
          }
          return  new Array(length).fill(defaultValue);
        },
        //-- see format.mapDomain as alternative, and simply import instead
        mapDomain: (val, [origMin, origMax], [newMin, newMax]) => {
            if (val < origMin) {
              return newMin;
            } else if (val > origMax) {
              return newMax;
            }
            // origMin / val / origMax = newMin / result / newMax
            // (val - origMin) / (origMax - origMin) = (result - newMin) / (newMax - newMin)
            // (val - origMin) * (newMax - newMin) / (origMax - origMin) = result - newMin;
            // (val - origMin) * (newMax - newMin) / (origMax - origMin) + newMin = result
            return (val - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
        },
        //-- see format.mapPeriod as alternative, and simply import it instead
        mapTime: (t, period) => {
            //-- see format.timePeriod as alternative, and simply import instead
            return t / period;
            // return (t.getTime() % period) / period;
        }
    }
})
```

![svg](img/noiseVisualization_wavesLight.svg)

![Screenshot of light animation](img/svgAnimation2Light.gif)

(If stopped, run the cell above again, see the section on stopping the animations for more)

## Alternative using the library functions

Instead of spelling out the functions, here is the same animation, but importing the library functions into the utilityFunctions.

```javascript
utils.svg.embed({
    debug: false,
    
    //-- width of the SVG Scene
    width: 720,
    //-- height of the SVG Scene
    height: 360,
    data: {
        //-- number of indicators along x and y axis
        xCount: 48,
        yCount: 24,
        //-- background color
        backgroundColor: '#FFF',
        //-- color range: 0: startingColor, 1: ending color
        initialColor: '#F0F',
        finalColor: '#0FF',
        //-- how fast or slow the period resets, simplex provides 1 cycle per period
        timePeriod: 10000,
        //-- how closely related the direction and length are in time
        timeOffset: 5000,
        //-- the minimum / maximum lengths of the indicators
        minLength: 10,
        maxLength: 50,
        //-- opacity and width of line
        width: 4,
        opacity: 0.2,
        //-- sensitivity [0 - 1]
        directionSensitivity: 0.8,
        lengthSensitivity: 0.4,
    },
    scripts: ['https://cdn.rawgit.com/josephg/noisejs/master/perlin.js'],
    onReady: ({ el, SVG, data, height, width, utilityFunctions: lib }) => {
        
        //-- make the background black
        el.node.setAttribute('style', `background-color: ${data.backgroundColor}`);
        
        const xCount = data.xCount;
        const yCount = data.yCount;
        
        const xRangeInc = 1 / xCount;
        const yRangeInc = 1 / yCount;
        
        const xInc = width / xCount;
        const yInc = height / yCount;
        
        const xMid = width / 2;
        const yMid = height / 2;
        
        const PI2 = Math.PI * 2;
        // const noiseRange = [-1, 1];
        
        const colorRange = new SVG.Color(data.initialColor).to(data.finalColor);
        
        const directionRange = [-data.directionSensitivity, data.directionSensitivity];
        const lengthRange = [-data.lengthSensitivity, data.lengthSensitivity];
        
        //-- initialize lines
        const lines = lib.size(yCount)
            .map(() => lib.size(xCount, () => el.line()));
        
        const animationCalls = lib.animationFrameCalls();
        
        animationCalls.stopOtherAnimations();
        
        const renderLines = () => {
            //-- render line
            let zDir = lib.timePeriod(data.timePeriod, new Date().getTime());
            let zLen = lib.timePeriod(data.timePeriod, new Date().getTime() + data.timeOffset);
            lines.forEach((row, rowIndex) => {
                row.forEach((line, colIndex) => {
                    const valDir = noise.simplex3(colIndex * xRangeInc, rowIndex * yRangeInc, zDir);
                    const dir = lib.mapDomain(valDir, directionRange, [0, PI2]);

                    const valLen = noise.simplex3(colIndex * xRangeInc, rowIndex * yRangeInc, zLen);
                    const len = lib.mapDomain(valLen, lengthRange, [data.minLength, data.maxLength]);
                    const colorC = lib.mapDomain(valLen, lengthRange, [0, 1]);

                    lib.plotLine(line, xInc, yInc, colIndex, rowIndex, dir, len);
                    lib.styleLine(line, colorRange, colorC, data.width, data.opacity);
                })
            });
            
            if (animationCalls.checkAnimationsAllowed()) {
                animationCalls.nextAnimationFrame(renderLines);
            }
        };
        renderLines();
    },
    utilityFunctions: {
        plotLine:(line, xInc, yInc, x, y, dir, mag) => {
            const xOff = xInc * x;
            const yOff = yInc * y;
            line.plot(
                xOff,
                yOff,
                xOff + Math.cos(dir) * mag,
                yOff + Math.sin(dir) * mag
            )
        },
        styleLine: (line, colorRange, c, width = 1, opacity = 1) => {
            line.stroke({
                color: colorRange.at(c).toHex(),
                width,
                opacity,
                linecap: 'round'
            });
        },
        
        //-- see svg/utilityFunctions.animationFrameCalls
        animationFrameCalls: utils.svg.utilityFunctions.animationFrameCalls,
        
        //-- see array.size as an alternative, and simply import it instead
        size: utils.array.size,
        
        //-- see format.mapDomain as alternative, and simply import instead
        mapDomain: utils.format.mapDomain,
        
        //-- see format.mapPeriod as alternative, and simply import it instead
        timePeriod: utils.format.timePeriod
    }
});
```

![svg](img/noiseVisualization_wavesLight.svg)

![Screenshot of light animation](img/svgAnimation2Light.gif)

(If stopped, run the cell above again, see the section on stopping the animations for more)

# X and Y Roll

Alternative version, where instead:

* the X and Y are calculated separately (y being generated on a timeOffset from x)
* the X and Y values are then projected onto cosine and sine respectively
* and then length is determined based on those components

```javascript
utils.svg.embed({
    debug: false,
    
    //-- width of the SVG Scene
    width: 720,
    //-- height of the SVG Scene
    height: 360,
    data: {
        //-- number of indicators along x and y axis
        xCount: 48,
        yCount: 24,
        //-- background color
        backgroundColor: '#000',
        //-- color range: 0: startingColor, 1: ending color
        initialColor: '#F0F',
        finalColor: '#0FF',
        //-- how fast or slow the period resets, simplex provides 1 cycle per period
        timePeriod: 10000,
        //-- how closely related the direction and length are in time
        timeOffset: 5000,
        //-- the minimum / maximum lengths of the indicators
        minLength: 10,
        maxLength: 50,
        //-- opacity and width of line
        width: 4,
        // opacity: 0.2, //-- not used
    },
    scripts: ['https://cdn.rawgit.com/josephg/noisejs/master/perlin.js'],
    onReady: ({ el, SVG, data, height, width, utilityFunctions: lib }) => {
        
        //-- make the background black
        el.node.setAttribute('style', `background-color: ${data.backgroundColor}`);
        
        const xCount = data.xCount;
        const yCount = data.yCount;
        
        const xRangeInc = 1 / xCount;
        const yRangeInc = 1 / yCount;
        
        const xInc = width / xCount;
        const yInc = height / yCount;
        
        const PI2 = Math.EI * 2;
        const RT2 = Math.sqrt(2);
        
        const colorRange = new SVG.Color(data.initialColor).to(data.finalColor);
        
        const lengthRange = data.maxLength - data.minLength;
        
        //-- initialize lines
        const lines = lib.size(yCount)
            .map(() => lib.size(xCount, () => el.line()));
        
        const anim = lib.animationFrameCalls();
        
        anim.stopOtherAnimations();
        
        const renderLines = () => {
            //-- render line
            const nowMilli = Date.now();
            let zX = lib.timePeriod(data.timePeriod, nowMilli);
            let zY = lib.timePeriod(data.timePeriod, nowMilli + data.timeOffset);
            
            lines.forEach((row, rowIndex) => {
                row.forEach((line, colIndex) => {
                    //-- we are moving through the zPlane (x, y, z) - based on time
                    const forceX = noise.simplex3(
                        colIndex * xRangeInc,
                        rowIndex * yRangeInc,
                        zX
                    );
                    const forceY = noise.simplex3(
                        colIndex * xRangeInc,
                        rowIndex * yRangeInc,
                        zY
                    );
                    // const length = Math.sqrt(forceX * forceX + forceY * forceY);
                    const length = ( Math.abs(forceX) + Math.abs(forceY) ) / 2;
                    const mappedLength = lib.mapDomain(length, [0, 1], [data.minLength, data.maxLength]);
                    
                    const rotatedX = Math.cos(forceX * Math.PI) * mappedLength;
                    const rotatedY = Math.sin(forceY * Math.PI) * mappedLength;
                    
                    lib.plotLine(line, xInc, yInc, colIndex, rowIndex, rotatedX, rotatedY);

                    const colorC = length; // lib.mapDomain(length, [0, 1], [0, 1]);
                    
                    lib.styleLine(line, colorRange, colorC, data.width, colorC);
                })
            });
            
            //-- stop the animation
            if (anim.checkAnimationsAllowed()) {
                anim.nextAnimationFrame(renderLines);
            }
        };
        
        renderLines();
    },
    utilityFunctions: {
        animationFrameCalls: utils.svg.utilityFunctions.animationFrameCalls,
        size: utils.array.size,
        mapDomain: utils.format.mapDomain,
        timePeriod: utils.format.timePeriod,
        clamp: (val, min, max) => {
            if (val < min) {
                return min;
            } else if (val > max) {
                return max;
            }
            return val;
        },
        
        plotLine: (line, xInc, yInc, x, y, forceX, forceY) => {
            const xOff = xInc * x;
            const yOff = yInc * y;
            line.plot(
                xOff,
                yOff,
                xOff + forceX,
                yOff + forceY
            )
        },
        styleLine: (line, colorRange, c, width = 1, opacity = 1) => {
            line.stroke({
                color: colorRange.at(c).toHex(),
                width,
                opacity,
                linecap: 'round'
            });
        }
    }
});
```

![svg](img/noiseVisualization_wavesDark.svg)

![Screenshot of dark animation](img/svgAnimation2Dark.gif)

# Alternative Using Canvas

Depending on the number of instances we want to run, using the canvas can be much faster.

(Modifying the dom through setAttribute on SVG can cause Garbage Collection to occur - leading to periodic jutters in the animations).

This also shows how simple it is to extend the ijs.htmlScript to support other libraries,
and the simplest example to understand.

```javascript
//-- could just as use utils.ijs.htmlScript
//-- (as this is how utils.svg.embed is done)

//-- https://jupyter-ijavascript-utils.onrender.com/tutorial-htmlScript.html

utils.ijs.htmlScript({
    debug: true,
    
    //-- note: width and height can also be set here
    
    //-- use Canvas instead for the main element
    html: `<canvas />`,

    scripts: [
        'https://cdn.rawgit.com/josephg/noisejs/master/perlin.js',
        //-- we are only using the svg library for the colorRange linear interpolation
        'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0.0/dist/svg.min.js'
    ],
    
    //-- data to prepare the document
    data: {
        canvasWidth: 720,
        canvasHeight: 360,
        
        //-- number of indicators along x and y axis
        xCount: 48,
        yCount: 24,
        //-- background color
        backgroundColor: '#000',
        //-- color range: 0: startingColor, 1: ending color
        initialColor: '#F0F',
        finalColor: '#0FF',
        //-- how fast or slow the period resets, simplex provides 1 cycle per period
        timePeriod: 10000,
        //-- how closely related the direction and length are in time
        timeOffset: 5000,
        //-- the minimum / maximum lengths of the indicators
        minLength: 10,
        maxLength: 50,
        //-- opacity and width of line
        width: 4,
        // opacity: 0.2, //-- not used
    },
    
    onReady: ({ rootEl, data, options, utilityFunctions: lib }) => {
        
        const canvas = rootEl.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        //-- width and height are converted to px (ex: ``${width}px`)
        const width = data.canvasWidth;
        const height = data.canvasHeight;
        
        //-- make the background black
        canvas.setAttribute('style', `background-color: ${data.backgroundColor}`);
        canvas.width = width;
        canvas.height = height;
        
        //-- number of inidcators to show
        const xCount = data.xCount;
        const yCount = data.yCount;
        
        //-- x-y position between 0-1
        const xRangeInc = 1 / xCount;
        const yRangeInc = 1 / yCount;
        
        //-- how much to increment for each column / row
        const xInc = width / xCount;
        const yInc = height / yCount;
        
        //-- catch the special case that min and max are the same
        const minMaxMatch = data.min === data.max;
        
        const colorRange = new SVG.Color(data.initialColor).to(data.finalColor);
        
        const lengthRange = data.maxLength - data.minLength;
        
        //-- initialize lines
        const lines = lib.size(yCount, (yIndex) =>
            lib.size(xCount, (xIndex) => ({
                xPos: xIndex * xInc,
                xNoise: xIndex * xRangeInc,
                yPos: yIndex * yInc,
                yNoise: yIndex * yRangeInc
            })))
            .flat();
        
        const anim = lib.animationFrameCalls();
        
        anim.stopOtherAnimations();
        
        const renderLines = () => {
            //-- render line
            const nowMilli = Date.now();
            let zX     = lib.timePeriod(data.timePeriod, nowMilli);
            let zY     = lib.timePeriod(data.timePeriod, nowMilli + data.timeOffset);
            let zColor = lib.timePeriod(data.timePeriod, nowMilli + data.timeOffset + data.timeOffset);

            //-- clear the canvas between frames
            ctx.fillStyle = data.backgroundColor;
            ctx.fillRect(0, 0, width, height);
            
            for (let lineObj of lines) {
                //-- we are moving through the zPlane (x, y, z) - based on time
                
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod
                const forceX = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zX
                );
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod + shift
                const forceY = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zY
                );
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod + shift
                const noiseColor = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zColor
                );

                //-- use shortcut to avoid Math.sqrt
                // const length = Math.sqrt(forceX * forceX + forceY * forceY);
                let length = ( Math.abs(forceX) + Math.abs(forceY) ) / 2;
                if (length > 1) length = 1;

                const mappedLength = lib.mapDomain(length, [0, 1], [data.minLength, data.maxLength]);

                const rotatedX = Math.cos(forceX * Math.PI) * mappedLength;
                const rotatedY = Math.sin(forceY * Math.PI) * mappedLength;

                //-- map the color to a place on the colorRange
                const colorVal = lib.mapDomain(noiseColor, [-1, 1], [0, 1]);
                const color = colorRange.at(colorVal);
                //-- note length is used for the alpha
                const colorStr = `rgb(${color.r},${color.g},${color.b},${length})`;

                ctx.strokeStyle = colorStr;
                ctx.lineWidth = minMaxMatch ? data.width : data.width * length;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(lineObj.xPos, lineObj.yPos);
                ctx.lineTo(lineObj.xPos + rotatedX, lineObj.yPos + rotatedY);
                // ctx.closePath();
                ctx.stroke();
            }
            
            //-- stop the animation
            if (anim.checkAnimationsAllowed()) {
                anim.nextAnimationFrame(renderLines);
            }
        };
        
        renderLines();
    },
    utilityFunctions: {
        animationFrameCalls: utils.svg.utilityFunctions.animationFrameCalls,
        size: utils.array.size,
        mapDomain: utils.format.mapDomain,
        timePeriod: utils.format.timePeriod,
        clamp: utils.format.clampDomain
    }
});
```

![svg](img/noiseVisualization_wavesDark.svg)

![Screenshot of dark animation](img/svgAnimation2Dark.gif)

# Final Version

* Gradients
* greater opacity near occlusion
* other updates

```javascript
//-- could just as use utils.ijs.htmlScript
//-- (as this is how utils.svg.embed is done)

//-- https://jupyter-ijavascript-utils.onrender.com/tutorial-htmlScript.html

utils.ijs.htmlScript({
    debug: true,
    
    //-- note: width and height can also be set here
    width: 720,
    height: 360,
    
    //-- use Canvas instead for the main element
    html: `<canvas />`,

    scripts: [
        'https://cdn.rawgit.com/josephg/noisejs/master/perlin.js',
        //-- we are only using the svg library for the colorRange linear interpolation
        'https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0.0/dist/svg.min.js'
    ],
    
    //-- data to prepare the document
    data: {
        // canvasWidth: 720,
        // canvasHeight: 360,
        
        //-- number of pixels between indicators
        density: 20,
        //-- background color
        backgroundColor: '#000000',
        //-- color range: 0: startingColor, 1: ending color
        initialColor: '#FF00FF',
        finalColor: '#00FFFF',
        //-- how fast or slow the period resets, simplex provides 1 cycle per period
        timePeriod: 10000,
        //-- how closely related the direction and length are in time
        timeOffset: 5000,
        //-- the minimum / maximum lengths of the indicators
        minLength: 10,
        maxLength: 100,
        //-- opacity and width of line
        width: 10
    },
    
    onReady: ({ rootEl, data, options, utilityFunctions: lib }) => {
        
        const canvas = rootEl.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        //-- width and height are converted to px (ex: ``${width}px`)
        const width = Number.parseInt(options.width);// data.canvasWidth;
        const height = Number.parseInt(options.height);// data.canvasHeight;
        
        //-- make the background black
        canvas.setAttribute('style', `background-color: ${data.backgroundColor}`);
        canvas.width = width;
        canvas.height = height;
        
        //-- number of inidcators to show
        const xCount = width / data.density;
        const yCount = height / data.density;
        
        //-- choose the greater of the densities
        const rangeInc = width <= height
            ? 1 / xCount
            : 1 / yCount;

        const xInc = width / xCount;
        const yInc = height / yCount;
        
        //-- catch the special case that min and max are the same
        const minMaxMatch = data.minLength === data.maxLength;
        
        const colorRange = new SVG.Color(data.initialColor).to(data.finalColor);
        
        //-- initialize lines
        const lines = lib.size(yCount, (yIndex) =>
            lib.size(xCount, (xIndex) => ({
                xPos: xIndex * xInc,
                xNoise: xIndex * rangeInc,
                yPos: yIndex * yInc,
                yNoise: yIndex * rangeInc
            })))
            .flat();
        
        const anim = lib.animationFrameCalls();
        
        anim.stopOtherAnimations();
        
        const renderLines = () => {
            //-- render line
            const nowTime = Date.now();
            let zX     = lib.timePeriod(data.timePeriod, nowTime);
            let zY     = lib.timePeriod(data.timePeriod, nowTime + data.timeOffset);
            let zColor = lib.timePeriod(data.timePeriod, nowTime + data.timeOffset + data.timeOffset);

            //-- clear the canvas between frames
            ctx.fillStyle = data.backgroundColor;
            ctx.fillRect(0, 0, width, height);
            
            for (let lineObj of lines) {
                //-- we are moving through the zPlane (x, y, z) - based on time
                
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod
                const forceX = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zX
                );
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod + shift
                const forceY = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zY
                );
                //-- [0 <= x <= 1], [0 <= y <= 1], timePeriod + shift
                const noiseColor = noise.simplex3(
                  lineObj.xNoise,
                  lineObj.yNoise,
                  zColor
                );

                //-- use shortcut to avoid Math.sqrt
                // const forceLength = Math.sqrt(forceX * forceX + forceY * forceY);
                let forceLength = ( Math.abs(forceX) + Math.abs(forceY) ) / 2;
                if (forceLength > 1) forceLength = 1;

                const mappedLength = lib.mapDomain(forceLength, [0, 1], [data.minLength, data.maxLength]);
        
                const rotatedX = Math.cos(forceX * Math.PI) * mappedLength;
                const rotatedY = Math.sin(forceY * Math.PI) * mappedLength;

                let rotatedLength = (Math.abs(rotatedX) + Math.abs(rotatedY)) / 2;

                let initialTransparency;
                if (minMaxMatch) {
                  //-- we want to see full color circles / no gradient
                  initialTransparency = 1;
                } else {
                  //-- make the gradient appear more opaque if closer to 0
                  //-- as it appears more 'overhead'
                  initialTransparency = lib.mapDomain(
                    rotatedLength,
                    [ 0, data.minLength ],
                    [ 1, 0 ]
                  );
                }

                //-- map the color to a place on the colorRange
                const colorVal = lib.mapDomain(noiseColor, [-1, 1], [0, 1]);
                const color = colorRange.at(colorVal);
                //-- note length is used for the alpha
                // const colorStr = `rgb(${color.r},${color.g},${color.b})`;

                //-- direction of the gradient (x1, y1, x2, y2)
                //-- as it is in the center of the circle
                const gradient = ctx.createLinearGradient(
                    lineObj.xPos, lineObj.yPos,
                    lineObj.xPos + rotatedX, lineObj.yPos + rotatedY
                );
                gradient.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${initialTransparency})`);
                gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},1)`);

                        ctx.strokeStyle = gradient;
                ctx.lineWidth = data.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(lineObj.xPos, lineObj.yPos);
                ctx.lineTo(lineObj.xPos + rotatedX, lineObj.yPos + rotatedY);
                // ctx.closePath();
                ctx.stroke();
            }
            
            //-- stop the animation
            if (anim.checkAnimationsAllowed()) {
                // anim.nextAnimationFrame(renderLines);
            }
        };
        
        renderLines();
    },
    utilityFunctions: {
        animationFrameCalls: utils.svg.utilityFunctions.animationFrameCalls,
        size: utils.array.size,
        mapDomain: utils.format.mapDomain,
        timePeriod: utils.format.timePeriod,
        clampDomain: utils.format.clampDomain
    }
});
```

![svg](img/noiseFinal.jpg)

![Screenshot of dark animation](img/noiseFinal.gif)

# Test with Vega

Note that something similar to vectors can be shown with vega-lite.

See their [Wind Vector Example - shown here](https://vega.github.io/vega-lite/examples/point_angle_windvector.html)
 / [Data Here](https://vega.github.io/vega-lite/examples/data/windvectors.csv)

```javascript
utils.vega.svgFromSpec({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Vector array map showing wind speed and direction.",
  "width": 615,
  "height": 560,
  "background": "black",
  "data": {
    "url": "https://vega.github.io/vega-lite/examples/data/windvectors.csv",
    "format": {"type": "csv", "parse": {"longitude": "number", "latitude": "number"}}
  },
  "projection": {"type": "identity"},
  "mark": {"type": "point", "shape": "wedge", "filled": true},
  "encoding": {
    "longitude": {"field": "longitude", "type": "quantitative"},
    "latitude": {"field": "latitude", "type": "quantitative"},
    "color": {
      "field": "dir", "type": "quantitative",
      "scale": {"domain": [0, 360], "scheme": "rainbow"},
      "legend": null
    },
    "angle": {
      "field": "dir", "type": "quantitative",
      "scale": {"domain": [0, 360], "range": [180, 540]}
    },
    "size": {
      "field": "speed", "type": "quantitative",
      "scale": {"rangeMax": 500}
    }
  },
  "config": {
    "aria": false,
    "view": {"step": 10, "fill": "black"}
  }
})
```

![svg](img/noiseVisualization_vlOrig.svg)

## Vega-Lite Projection Alternative

As an alternative to building a map (through projection), we can instead sort by the latitude and longitude values and simply place them on a grid. (Making the process quite a bit simpler)

```javascript
utils.vega.svg((vl) => vl.markPoint({shape: 'wedge', filled: true})
  .data(vl.csv('https://vega.github.io/vega-lite/examples/data/windvectors.csv').parse({longitude: 'number', latitude: 'number'}))
  .width(600).height(600)
  .encode(
    vl.x().fieldO('longitude').sort('ascending').axis(null),
    vl.y().fieldO('latitude').sort('ascending').axis(null),
    vl.color().fieldQ('dir').legend(null).scale({domain: [0, 360], scheme: 'rainbow'}),
    vl.angle().fieldQ('dir').scale({domain: [0, 360], range: [180, 540]}),
    vl.size().fieldQ('speed').scale({range: [50, 600]}).legend(null)
  )
  .config({view: {step: 11, stroke: null}}) // use 11px steps for x and y scales
  .background('black')
)
```

![svg](img/noiseVisualization_vlSimple.svg)

## Details on Vectors.csv

For anyone curious...

```
utils.ijs.await(async(display, console) => {
  windVectorsString = await utils.dataset.fetchText('https://vega.github.io/vega-lite/examples/data/windvectors.csv');

  windVectors = windVectorsString.split('\r\n')
    .map(line => line.split(','))
    .slice(1)
    .map(([ longitude, latitude, dir, dirCat, speed]) => ({longitude, latitude, dir, dirCat, speed}));
});
```

```
windVectors[0]

// {
//   longitude: '0.125',
//   latitude: '45.125',
//   dir: '228',
//   dirCat: '225',
//   speed: '3.12'
// }
```