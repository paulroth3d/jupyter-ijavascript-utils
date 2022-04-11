/* eslint-disable no-undef, no-param-reassign */

/**
 * Internal collection of JavaScript code
 * that is used by HTML Script.
 * 
 * (Such as for Leaflet, or Vega, etc.)
 * 
 * They should still be tested,
 * but it seems that making them accessible
 * (since they will never actually be called by node
 * - only pushed to the browser)
 * they should be put here to avoid polluting the interface. 
 * @private
 */
module.exports = {};
InternalHtmlScripts = module.exports;

/**
 * JavaScript side function for when the embedFromSpec is Ready
 * @private
 */
module.exports.embedFromSpecOnReady = function embedFromSpecOnReady({ rootEl, data }) {
  const yourVlSpec = data;
  vegaEmbed(rootEl, yourVlSpec);
};

/**
 * Code executed by JavaScript - not node
 * @private
 */
module.exports.leafletMarkersOnReady = function leafletMarkersOnReady({ map, leaflet, data }) {
  const markerData = data;

  // eslint-disable-next-line new-cap
  const mapMarkers = markerData.map(([lat, lon, title], index) => new leaflet.marker([lat, lon])
    .bindPopup(title || String(index))
    .addTo(map));

  const markerGroup = leaflet.featureGroup(mapMarkers);

  map.fitBounds(markerGroup.getBounds().pad(0.2));
};

/**
 * JavaScript side 'onReady' function once katex.js has finished loading.
 * @see {@link module:ijs.htmlScript}
 * @private
 */
module.exports.katexRenderOnReady = function katexRenderOnReady({ rootEl, data }) {
  const {
    expression,
    katexOptions
  } = data;

  if (typeof window.WebFontConfig === 'undefined') {
    window.WebFontConfig = {
      custom: {
        families: ['KaTeX_AMS', 'KaTeX_Caligraphic:n4,n7', 'KaTeX_Fraktur:n4,n7',
          'KaTeX_Main:n4,n7,i4,i7', 'KaTeX_Math:i4,i7', 'KaTeX_Script',
          'KaTeX_SansSerif:n4,n7,i4', 'KaTeX_Size1', 'KaTeX_Size2', 'KaTeX_Size3',
          'KaTeX_Size4', 'KaTeX_Typewriter'],
      }
    };
      
    ((d) => {
      const wf = document.createElement('script');
      wf.src = 'https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js';
      wf.async = true;
      d.append(wf);
    })(rootEl);
  }

  katex.render(expression, rootEl, katexOptions);
};
