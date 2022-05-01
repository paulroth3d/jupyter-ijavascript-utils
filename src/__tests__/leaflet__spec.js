/* eslint-disable quotes */

const LeafletUtils = require('../leaflet');

const IJSUtils = require('../ijs');

// onst FileUtils = require('../file');

const removeIJSContext = () => {
  delete global.$$;
};

const createNewDisplay = (name) => {
  const valueFn = (value) => `display:${name}:${(value)}`;
  const newDisplay = ({
    async: () => {},
    text: valueFn,
    png: valueFn,
    svg: valueFn,
    html: valueFn,
    jpg: valueFn,
    mime: valueFn,
    sendResults: valueFn
  });
  return newDisplay;
};

const prepareIJSContext = () => {
  const newContext = ({
    ...createNewDisplay(),
    createDisplay: createNewDisplay,
    sendResult: () => {}
  });
  global.$$ = newContext;

  // global.console = ({
  //   error: jest.fn(),
  //   log: jest.fn(),
  //   warn: jest.fn()
  // });
};

global.describe('leaflet', () => {
  global.describe('option_defaults', () => {
    global.it('has defaults', () => {
      global.expect(typeof LeafletUtils.OPTION_DEFAULTS).toBe('object');
    });
  });
  global.describe('OPTION_DEFAULTS', () => {
    global.it('has a provider by default', () => {
      const typeofProviderFn = typeof LeafletUtils.OPTION_DEFAULTS.providerFn;
      const isProviderFunctionOrString = typeofProviderFn === 'string' || typeofProviderFn === 'function';
      global.expect(isProviderFunctionOrString).toBe(true);

      const mapMock = {};
      const leafletResultMock = {
        addTo: jest.fn()
      };
      const leafletMock = {
        tileLayer: jest.fn()
      };
      leafletMock.tileLayer.mockReturnValue(leafletResultMock);

      LeafletUtils.OPTION_DEFAULTS.providerFn({ map: mapMock, leaflet: leafletMock });

      global.expect(leafletMock.tileLayer).toHaveBeenCalled();
      global.expect(leafletResultMock.addTo).toHaveBeenCalled();
    });
  });
  global.describe('providers', () => {
    global.beforeEach(() => {
      LeafletUtils.resetProvider();
    });
    global.afterAll(() => {
      LeafletUtils.resetProvider();
    });
    global.it('has a provider by default', () => {
      const typeofProviderFn = typeof LeafletUtils.OPTION_DEFAULTS.providerFn;
      const isProviderFunctionOrString = typeofProviderFn === 'string' || typeofProviderFn === 'function';
      global.expect(isProviderFunctionOrString).toBe(true);

      const mapMock = {};
      const leafletResultMock = {
        addTo: jest.fn()
      };
      const leafletMock = {
        tileLayer: jest.fn()
      };
      leafletMock.tileLayer.mockReturnValue(leafletResultMock);

      LeafletUtils.OPTION_DEFAULTS.providerFn({ map: mapMock, leaflet: leafletMock });

      global.expect(leafletMock.tileLayer).toHaveBeenCalled();
      global.expect(leafletResultMock.addTo).toHaveBeenCalled();
    });
    global.it('set provider changes the provider', () => {
      const newProvider = 'newProvider';
      LeafletUtils.setProvider(newProvider);
      const results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      const expected = newProvider;
      global.expect(results).toBe(expected);
    });
    global.it('set provider fn changes the provider', () => {
      const newProvider = () => {};
      LeafletUtils.setProviderFn(newProvider);
      const results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      const expected = newProvider;
      global.expect(results).toBe(expected);
    });
    global.it('resetProvider resets the provider', () => {
      const newProvider = 'newProvider';
      const originalProvider = LeafletUtils.OPTION_DEFAULTS.providerFn;

      LeafletUtils.setProvider(newProvider);
      let results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      let expected = newProvider;
      global.expect(results).toBe(expected);

      LeafletUtils.resetProvider();
      results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      expected = originalProvider;

      global.expect(results).not.toBe(expected);
      global.expect(results.toString()).toBe(expected.toString());
    });
    global.it('setProvider(null) resets the provider', () => {
      const newProvider = 'newProvider';
      const originalProvider = LeafletUtils.OPTION_DEFAULTS.providerFn;

      LeafletUtils.setProvider(newProvider);
      let results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      let expected = newProvider;
      global.expect(results).toBe(expected);

      LeafletUtils.setProvider();
      results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      expected = originalProvider;

      global.expect(results).not.toBe(expected);
      global.expect(results.toString()).toBe(expected.toString());
    });
    global.it('setProviderFn(null) resets the provider', () => {
      const newProvider = 'newProvider';
      const originalProvider = LeafletUtils.OPTION_DEFAULTS.providerFn;

      LeafletUtils.setProvider(newProvider);
      let results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      let expected = newProvider;
      global.expect(results).toBe(expected);

      LeafletUtils.setProviderFn();
      results = LeafletUtils.OPTION_DEFAULTS.providerFn;
      expected = originalProvider;

      global.expect(results).not.toBe(expected);
      global.expect(results.toString()).toBe(expected.toString());
    });
  });

  global.describe('all render', () => {
    // const ORIGINAL_CONSOLE = global.console;

    global.beforeEach(() => {
      prepareIJSContext();
      LeafletUtils.OPTION_DEFAULTS.version = '1.6.1';
      LeafletUtils.OPTION_DEFAULTS.providerVersion = '1.6.2';
      LeafletUtils.OPTION_DEFAULTS.providerFn = 'testProvider';
    });
    global.afterEach(() => {
      removeIJSContext();
    });
    global.afterAll(() => {
      prepareIJSContext();
      LeafletUtils.OPTION_DEFAULTS.version = '1.6.0';
      LeafletUtils.OPTION_DEFAULTS.providerVersion = '1.13.0';
    });

    global.describe('render', () => {
      global.it('expect we are in the ijs context', () => {
        const context = IJSUtils.detectContext();
        global.expect(context).toBeTruthy();
      });

      //-- #     #     #     #     #     #     #     #     #
      //-- code check
      //-- #     #     #     #     #     #     #     #     #
      
      global.it('can render', () => {
        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const results = LeafletUtils.render({ onReady, uuid: 'someUUID' });
        const expected = `<html><body>
  <div uuid="someUUID" style="width:100%; height: 200px"></div>
  <div scriptUUID="someUUID" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('someUUID', {
      scriptIndex: -1,
      scriptsToLoad: ["https://unpkg.com/leaflet@1.6.1/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.6.2/leaflet-providers.js"],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        const rootEl = document.querySelector('div[uuid="someUUID"]');

        const options = {
          uuid: 'someUUID',
          width: '100%',
          height: '200px',
          scripts: ["https://unpkg.com/leaflet@1.6.1/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.6.2/leaflet-providers.js"],
          css: ["https://unpkg.com/leaflet@1.6.1/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.6.2/leaflet-providers.js"],
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
        if (!L.tileLayer.provider) console.error('Leaflet.tileLayer.provider is null');
        map = L.map(rootEl, {});

        L.tileLayer.provider('testProvider').addTo(map);

        (({
          map,
          leaflet
        }) => {
          console.log('leaflet is ready');
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

    externalScriptLoaded('someUUID');
  </script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.1/dist/leaflet.css"
  crossorigin=""
  uuid="someUUID"
/>
</body></html>
`;

        // FileUtils.writeFileStd('./tmp/tmp', results);

        global.expect(results).toStrictEqual(expected);
      });

      //-- #     #     #     #     #     #     #     #     #
      //-- section checks
      //-- #     #     #     #     #     #     #     #     #
      
      global.it('passes on map options', () => {
        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const mapOptions = { map: 'options' };
        const results = LeafletUtils.render({ onReady, uuid: 'someUUID', mapOptions });
        const expected = 'map = L.map(rootEl, {"map":"options"});';

        // FileUtils.writeFileStd('./tmp/tmp', results);

        // global.expect(results).toStrictEqual(expected);
        global.expect(results).toContain(expected);
      });
      global.it('passes on empty map options if null', () => {
        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const mapOptions = null;
        const results = LeafletUtils.render({ onReady, uuid: 'someUUID', mapOptions });
        const expected = 'map = L.map(rootEl, {});';

        // FileUtils.writeFileStd('./tmp/tmp', results);

        // global.expect(results).toStrictEqual(expected);
        global.expect(results).toContain(expected);
      });
      global.it('passes on the provider if passed', () => {
        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const provider = 'myCustomProvider';
        const options = {
          provider,
          onReady,
          uuid: 'test'
        };
        const results = LeafletUtils.render(options);
        const expected = `L.tileLayer.provider('myCustomProvider').addTo(map)`;

        // FileUtils.writeFileStd('./tmp/tmp', results);

        // global.expect(results).toStrictEqual(expected);
        global.expect(results).toContain(expected);
      });
      global.it('passes on the provider if passed', () => {
        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const provider = () => { console.log('customProviderFn'); };
        const options = {
          provider,
          onReady,
          uuid: 'test'
        };
        const results = LeafletUtils.render(options);
        const expected = `console.log('customProviderFn')`;

        // FileUtils.writeFileStd('./tmp/tmp', results);

        // global.expect(results).toStrictEqual(expected);
        global.expect(results).toContain(expected);
      });

      //-- #     #     #     #     #     #     #     #     #
      //-- failure checks
      //-- #     #     #     #     #     #     #     #     #

      global.it('throws an error if options are not provided', () => {
        try {
          LeafletUtils.render(null);
          global.jest.fail('exception should be thrown if no options provided');
        } catch (err) {
          //-- do nothing;
        }
      });
      global.it('throws an error if the provider is null', () => {
        //-- should never happen, but still...
        LeafletUtils.OPTION_DEFAULTS.providerFn = null;

        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const options = {
          onReady,
          uuid: 'testUUID'
        };

        try {
          LeafletUtils.render(options);
          global.jest.fail('exception should be thrown if no options provided');
        } catch (err) {
          //-- do nothing;
        }
      });
      global.it('throws an error if the provider is not a string or fn', () => {
        //-- should never happen, but still...
        LeafletUtils.OPTION_DEFAULTS.providerFn = null;

        const onReady = ({ map, leaflet }) => {
          console.log('leaflet is ready');
        };
        const options = {
          onReady,
          uuid: 'testUUID',
          provider: { first: 'name' }
        };

        try {
          LeafletUtils.render(options);
          global.jest.fail('exception should be thrown if no options provided');
        } catch (err) {
          //-- do nothing;
        }
      });
    });

    global.describe('renderMarkers', () => {
      global.it('expect we are in the ijs context', () => {
        const context = IJSUtils.detectContext();
        global.expect(context).toBeTruthy();
      });

      //-- #     #     #     #     #     #     #     #     #
      //-- code check
      //-- #     #     #     #     #     #     #     #     #

      global.it('can renderMarkers', () => {
        const markers = [
          [1, 2, 'title']
        ];

        const options = {
          uuid: 'testUUID'
        };
        const results = LeafletUtils.renderMarkers(markers, options);

        const expected = `const data = [[1,2,"title"]];`;

        // FileUtils.writeFileStd('./tmp/tmp', results);

        global.expect(results).toContain(expected);
      });

      global.it('throws errors if no markers are sent', () => {
        try {
          LeafletUtils.renderMarkers(null, { uuid: 'testUUID' });
          global.jest.fail('exception must be thrown if markers is null');
        } catch (err) {
          //-- do nothing
        }
      });
      global.it('throws errors if markers are empty', () => {
        const markers = [];
        try {
          LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
          global.jest.fail('exception must be thrown if markers is null');
        } catch (err) {
          //-- do nothing
        }
      });

      global.describe('marker array', () => {
        global.it('throws errors if markers arrays are 2d empty', () => {
          const markers = [[]];
          try {
            LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
            global.jest.fail('exception must be thrown if markers is null');
          } catch (err) {
            //-- do nothing
          }
        });
        global.it('throws errors if markers have no lat lon', () => {
          const markers = [[1], [2]];
          try {
            LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
            global.jest.fail('exception must be thrown if markers is null');
          } catch (err) {
            //-- do nothing
          }
        });
        global.it('succeeds if there is a lat, lon', () => {
          const markers = [[1, 1], [2, 2]];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
          const expected = `const data = [[1,1],[2,2]];`;

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toContain(expected);
        });
        global.it('succeeds if there is a lat, lon and title', () => {
          const markers = [[1, 1, 'A'], [2, 2, 'B']];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
          const expected = `const data = [[1,1,"A"],[2,2,"B"]];`;

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toContain(expected);
        });
        global.it('succeeds if there is a lat, lon and title and more', () => {
          const markers = [[1, 1, 'A', 'C'], [2, 2, 'B', 'D']];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toBeTruthy();
        });
      });
      global.describe('marker objects', () => {
        global.it('throws errors if markers arrays are empty objects', () => {
          const markers = [{}];
          try {
            LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
            global.jest.fail('exception must be thrown if markers is null');
          } catch (err) {
            //-- do nothing
          }
        });
        global.it('throws errors if markers have no lat lon', () => {
          const markers = [{ lat: 1 }, { lat: 2 }];
          try {
            LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
            global.jest.fail('exception must be thrown if markers is null');
          } catch (err) {
            //-- do nothing
          }
        });
        global.it('succeeds if there is a lat, lon', () => {
          const markers = [{ lat: 1, lon: 1 }, { lat: 2, lon: 2 }];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
          const expected = `const data = [[1,1,null],[2,2,null]];`;

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toContain(expected);
        });
        global.it('succeeds if there is a lat, lon and title', () => {
          const markers = [{ lat: 1, lon: 1, title: 'A' }, { lat: 2, lon: 2, title: 'B' }];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });
          const expected = `const data = [[1,1,"A"],[2,2,"B"]];`;

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toContain(expected);
        });
        global.it('succeeds if there is a lat, lon and title and more', () => {
          const markers = [{ lat: 1, lon: 1, title: 'A', school: 'rock' }, { lat: 2, lon: 2, title: 'B', school: 'college' }];
          const results = LeafletUtils.renderMarkers(markers, { uuid: 'testUUID' });

          // FileUtils.writeFileStd('./tmp/tmp', results);
          global.expect(results).toBeTruthy();
        });
      });
    });
  });
});
