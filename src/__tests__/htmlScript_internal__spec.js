/**
 * @jest-environment jsdom
 */
/* global window */

const HtmlScriptInternal = require('../htmlScript_internal');

global.describe('htmlScript_internal', () => {
  global.it('can tell 2+2', () => {
    global.expect(2 + 2).toBe(4);
  });

  global.describe('leafletMarkersOnReady', () => {
    global.it('covers javascript with title', () => {
      const data = [[1, 1, 'A']];
      const leaflet = {
        marker: jest.fn(),
        bindPopup: jest.fn(),
        addTo: jest.fn(),
        featureGroup: jest.fn(),
        getBounds: jest.fn(),
        pad: jest.fn()
      };
      leaflet.marker.mockReturnValue(leaflet);
      leaflet.bindPopup.mockReturnValue(leaflet);
      leaflet.addTo.mockReturnValue(leaflet);
      leaflet.featureGroup.mockReturnValue(leaflet);
      leaflet.getBounds.mockReturnValue(leaflet);
      leaflet.pad.mockReturnValue(leaflet);
      const map = {
        fitBounds: jest.fn()
      };
      map.fitBounds.mockReturnValue(map);

      HtmlScriptInternal.leafletMarkersOnReady({ map, leaflet, data });
    });
    global.it('covers javascript without title', () => {
      const data = [[1, 1]];
      const leaflet = {
        marker: jest.fn(),
        bindPopup: jest.fn(),
        addTo: jest.fn(),
        featureGroup: jest.fn(),
        getBounds: jest.fn(),
        pad: jest.fn()
      };
      leaflet.marker.mockReturnValue(leaflet);
      leaflet.bindPopup.mockReturnValue(leaflet);
      leaflet.addTo.mockReturnValue(leaflet);
      leaflet.featureGroup.mockReturnValue(leaflet);
      leaflet.getBounds.mockReturnValue(leaflet);
      leaflet.pad.mockReturnValue(leaflet);
      const map = {
        fitBounds: jest.fn()
      };
      map.fitBounds.mockReturnValue(map);

      HtmlScriptInternal.leafletMarkersOnReady({ map, leaflet, data });
    });
  });

  global.describe('embedFromSpecOnReady', () => {
    global.beforeEach(() => {
      global.vegaEmbed = jest.fn();
    });
    global.afterAll(() => {
      delete global.vegaEmbed;
    });
    global.it('can mock javascript', () => {
      const callArgs = ({ rootEl: { type: 'rootEl' }, data: { type: 'data' } });
      HtmlScriptInternal.embedFromSpecOnReady(callArgs);

      //-- now included in global scope because of htmlScript includes
      global.expect(global.vegaEmbed).toHaveBeenCalled();

      global.expect(global.vegaEmbed.mock.calls[0][0]).toBe(callArgs.rootEl);
      global.expect(global.vegaEmbed.mock.calls[0][1]).toBe(callArgs.data);
    });
  });

  global.describe('katexRenderOnReady', () => {
    global.beforeEach(() => {
      window.WebFontConfig = {
        custom: {}
      };
      global.katex = ({
        render: jest.fn()
      });
    });
    global.afterAll(() => {
      delete global.katex;
      delete window.WebFontConfig;
    });
    global.it('can js if window.WebFontConfig is set', () => {
      const rootEl = {};
      rootEl.createElement = jest.fn().mockReturnValue(rootEl);
      rootEl.append = jest.fn().mockReturnValue(rootEl);
  
      const data = ({
        expression: 'example',
        katexOptions: { options: 'katex' }
      });
  
      HtmlScriptInternal.katexRenderOnReady({ rootEl, data });

      global.expect(global.katex.render).toHaveBeenCalled();
      global.expect(global.katex.render.mock.calls[0][0]).toBe(data.expression);
      global.expect(global.katex.render.mock.calls[0][2]).toStrictEqual(data.katexOptions);
    });
    global.it('script added if window.WebFontConfig is not set', () => {
      const rootEl = {};
      rootEl.createElement = jest.fn().mockReturnValue(rootEl);
      rootEl.append = jest.fn().mockReturnValue(rootEl);
  
      const data = ({
        expression: 'example',
        katexOptions: {}
      });

      delete window.WebFontConfig;
  
      HtmlScriptInternal.katexRenderOnReady({ rootEl, data });

      global.expect(rootEl.append).toHaveBeenCalled();
    });
  });
});
