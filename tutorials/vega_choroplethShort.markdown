**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/ex_ChoroplethLong.ipynb)**

# Lets make a Choropleth

A choropleth is essentially a data driven map, that changes the map in some regard based on those values.

A very familiar example are the red and blue styles shading of states for US Elections,
but can show many things such as precipitation, or heatmaps, and many other things.

![Screenshot - example choropleth](img/choropleth_example.svg)

## Configure the Map

Maps don't show year over year very well.

To simplify finding this, here is the configuration:


```javascript
currentYear = 1955;
```




    1955




```javascript
currentMetric = 'prop';
```




    'prop'



# Libraries

We will use the following libraries:

```
utils = require('jupyter-ijavascript-utils');
geographyDatastore = require('sane-topojson');
countryISO = require('i18n-iso-countries');
topojson = require('topojson-client');
['utils', 'geographyDatastore', 'countryCodes', 'topojson'];
```

## jupyter-ijavascript-utils

Very helpful library for doing data exploration and visualization within Jupyter Notebooks -
using the iJavaScript Library.

This library in fact - [see more here](https://jupyter-ijavascript-utils.onrender.com/)

## topojson-client - `topojson`

[TopoJSON](https://github.com/topojson/topojson-specification) is an an open format extension from the [GeoJSON](#geojson) format, that can be converted to and from GeoJSON.

Even though it can store more data into it, it can also result in much smaller files dues to how it organizes data.

The [topojson-client](https://github.com/topojson/topojson-client) library provides a way to:

* convert shape / geojson files to and from topojson files
* access geographic features

## sane-topojson - `geographyDatastore`

[Natural Earth](https://www.naturalearthdata.com/downloads/) is a public domain map dataset available at 1:10m, 1:50m, and 1:110 million scales. Featuring tightly integrated vector and raster data, with Natural Earth you can make a variety of visually pleasing, well-crafted maps with cartography or GIS software.

Natural Earth was built through a collaboration of many volunteers and is supported by NACIS (North American Cartographic Information Society), and is free for use in any type of project ([see their terms of use](https://www.naturalearthdata.com/about/terms-of-use/)).

In our case, we'll be using the [sane-topojson](https://www.npmjs.com/package/sane-topojson) library as it provides a 'cleaned version' of the Natural Earth GIS data that can be accessed directly within node.

(As opposed to the [world-atlas](https://github.com/topojson/world-atlas) library that is only accessible through CDNs)

We'll be using this to:

* access the country geographies that we will render

## i18n-iso-countries - `countryISO`

We will use the [i18n-iso-countries](https://www.npmjs.com/package/i18n-iso-countries) library to help us correlate countries by looking them up to the ISO 3166 standard.

[ISO 3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) specifies the Numerical, 2 character and 3 character Country Codes, and will allow us to relate the countries to their geometry.

* identify 3 character iso codes for country names (joining)
* verify country names that need manual alignment


```javascript
utils = require('jupyter-ijavascript-utils');
geographyDatastore = require('sane-topojson');
countryISO = require('i18n-iso-countries');
topojson = require('topojson-client');
['utils', 'geographyDatastore', 'countryCodes', 'topojson'];
```




    [ 'utils', 'topojson', 'countryISO', 'geographyDatastore' ]



# Gap Minder

The [GapMinder Life Expectancy Study](https://www.gapminder.org/answers/how-does-income-relate-to-life-expectancy/) is a facinating dataset and writeup by the GapMinder group, including Professor Hans Rosling.

We'll access this through the [vega-datasets](https://github.com/vega/vega-datasets) library

It provides: 

Property    | Type   | Description
--          | --     | --
year        | Number | The year of the sample
country     | String | Name of the country
pop         | Number | Population of the country
life_expect | Number | Expected Lifespan within that country at that time
fertility   | Number | Reproduction coefficient

**NOTE: the country names are not standardized** - so we'll need to address that.

Next we want to pull the latest gapminder data.

(As an async method, we can use await to fetch the data)


```javascript
utils.ijs.await(async ($$, console) => {
    gapMinder = await utils.datasets.fetch('gapminder.json');
    return ['gapMinder'];
});
```




    [ 'gapMinder' ]



The following years are available:

`1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005`

And the countries available seem to be the same for all the years.

Good to go.

# Translate Countries to ISO Codes

So ultimately we need to translate the countries in the GapMinder set to those supported by the map

(We'll come back to this under the [WorldGeography Organization - geographyDatastore section](#World-Geography-organization---geographyDatastore) below)


```javascript
topojson.feature(geographyDatastore.world_50m, 'countries').features.map(r => r.id)
```




    [
      'ZWE', 'ZMB', 'YEM', 'VNM', 'VEN',     'VAT',
      'VUT', 'UZB', 'URY', 'FSM', 'MHL',     'MNP',
      'VIR', 'GUM', 'ASM', 'PRI', 'USA',     'SGS',
      'IOT', 'SHN', 'PCN', 'AIA', 'FLK',     'CYM',
      'BMU', 'VGB', 'TCA', 'MSR', 'JEY',     'GGY',
      'IMN', 'GBR', 'ARE', 'UKR', 'UGA',     'TKM',
      'TUR', 'TUN', 'TTO', 'TON', 'TGO',     'TLS',
      'THA', 'TZA', 'TJK', 'TWN', 'SYR',     'CHE',
      'SWE', 'SWZ', 'SUR', 'SSD', 'SDN',     'LKA',
      'ESP', 'KOR', 'ZAF', 'SOM', undefined, 'SLB',
      'SVK', 'SVN', 'SGP', 'SLE', 'SYC',     'SRB',
      'SEN', 'SAU', 'STP', 'SMR', 'WSM',     'VCT',
      'LCA', 'KNA', 'RWA', 'RUS', 'ROU',     'QAT',
      'PRT', 'POL', 'PHL', 'PER', 'PRY',     'PNG',
      'PAN', 'PLW', 'PAK', 'OMN', 'NOR',     'PRK',
      'NGA', 'NER', 'NIC', 'NZL', 'NIU',     'COK',
      'NLD', 'ABW', 'CUW', 'NPL',
      ... 141 more items
    ]



## Country Codes

In particular - notice the `id` field under the feature,
in this case they are the [iso 3166 standard of country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)

For example:

Country name                            |Official state name             |Sovereignty|Alpha-2 code|Alpha-3 code|Numeric code|Subdivision code links|Internet ccTLD
--                                         |--                                 |--                  |--             |--             |--             |--                       |--               
Islamic Republic of Afghanistan Afghanistan|The Islamic Republic of Afghanistan|UN member state     |AF             |AFG            |004            |ISO 3166-2:AF            |.af 

Notice there are three main codes to understand:

* Alpaa-3 Code - a 3 letter code for the country - ex: 'AFG'
* Alpha-2 Code - a 2 letter code for the country - ex: 'AF'
* Numeric Code - a numeric code for the country - ex: '004' or just '4'

In the case for `sane-topojson`, it uses the three letter `Alpha-3 code`, with other cases like the [topojson/topojson](https://github.com/topojson/topojson) library, uses the Numeric code instead.

Looks like all countries can be translated to ISO,
so we'll update them to include the `Alpha 3 Code`


```javascript
gapMinder = gapMinder.map((record) => ({
    ...record,
    //-- add on the property countryISO 
    countryISO: countryISO.getSimpleAlpha3Code(record.country, 'en')
}));

utils.array.peekFirst(gapMinder);
```




    {
      year: 1955,
      country: 'Afghanistan',
      cluster: 0,
      pop: 8891209,
      life_expect: 30.332,
      fertility: 7.7,
      countryISO: 'AFG'
    }



## World Geography organization - geographyDatastore

Now, lets look at the geography data available.

The data for `sane-topojson` is stored is as follows:

* [top level]
  * document
    * feature
      * geometries

### Document

Where the documents can be found by Object.keys(atlas) and are as follows:

`world_110m, world_50m, africa_110m, africa_50m, asia_110m, asia_50m, europe_110m, europe_50m, north-america_110m, north-america_50m, south-america_110m, south-america_50m, usa_110m, usa_50m`

Each representing a dataset (like the world or asia) and the detail level (50m having more detail than at 110m for example)

**We want to use the `world_50m` map**

because the `world_110m` map does not include all the countries referenced in Gap Minder dataset.**

### Features Available

The Features available are under \`geographyDatastore.[document].objects.[feature name]\`

Different documents can have different features available.

In the case of the \`sane-topojson\`, this is the breakdown
(it seems fairly even across)

document          |featuresSupported                                                    
--                |--                                                                   
world_110m        |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
world_50m         |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
africa_110m       |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
africa_50m        |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
asia_110m         |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
asia_50m          |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
europe_110m       |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
europe_50m        |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
north-america_110m|["coastlines","land","ocean","lakes","rivers","countries","subunits"]
north-america_50m |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
south-america_110m|["coastlines","land","ocean","lakes","rivers","countries","subunits"]
south-america_50m |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
usa_110m          |["coastlines","land","ocean","lakes","rivers","countries","subunits"]
usa_50m           |["coastlines","land","ocean","lakes","rivers","countries","subunits"]

## Countries

However, instead of accessing directly, we would recommend you use the "topojson" library to access these feature:

ex: topojson.feature(atlas.world_50m, 'countries')

That looks like this:


```javascript
utils.vega.svgFromSpec({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 500,
  "height": 300,
  "data": {
    values: geographyDatastore.world_50m,
    //-- note the feature is specific to countries - one of the features of the dataset.
    "format": {"type": "topojson", "feature": "countries"}
  },
  //-- projection type from one of the following:
  "projection": {"type": 'naturalEarth1'},
  "mark": {"type": "geoshape", "fill": "lightgray", "stroke": "gray"}
});

//-- other projection types:
// albers,albersUsa,azimuthalEqualArea,azimuthalEquidistant,conicConformal,
// conicEqualArea,conicEquidistant,equalEarth,equirectangular,gnomonic,mercator,
// naturalEarth1,orthographic,stereographic,transverseMercator
```

![svg](img/choropleth_simpleMap.svg)

What we want to do is change the color of the country based on the metric.

## Merge the Data

For simplicity's sake, we will update the records on the Geography to have a `mapValue` property.

(There are ways to do the transformations within Vega, but they are complex and difficult to troubleshoot,
so we will handle them in a different doc, with an example below just for demonstration).

### Transformation function

Function that determines a metric for a given year and countryISO code


```javascript
getCountryValue = (metric, year, countryISO) => utils.array.peekFirst(
        gapMinder.filter((r) => r.year === year && r.countryISO === countryISO),
        {}
    )[metric];
```

    [Function: getCountryValue]

## Create the Choropleth Data

Now let's create a specific version of the data we can use for charting.

(Note - in an immutable manner to avoid race conditions between cells)


```javascript
generateMapData = (metric, year) => topojson.feature(geographyDatastore.world_50m, 'countries')
    .features
    .map((entry) => ({ mapValue: getCountryValue(metric, year, entry.id), ...entry }));

// ex: generateMapData('pop', 1955)
```

    [Function: generateMapData]

## Create the Choropleth

```javascript
utils.vega.svgFromSpec({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "mark": {
    "type": "geoshape",
    "stroke": "white"
  },
  "data": {
      // specify which property and year we want to use from the Gap Minder dataset
      "values": generateMapData('life_expect', 1955)
  },
  "encoding": {
    "color": {
      "condition": {
        "test": { not: "isDefined(datum.mapValue)" },
        "value": "darkgrey"
      },
      "field": "mapValue",
      "type": "quantitative",
      "scale": {
        "scheme": "spectral"
      }
    }
  },
  "projection": {
    "type": "naturalEarth1",
  },
  "width": 900,
  "height": 500,
  "config": {
    "mark": {"invalid": null}
  }
});
```

![svg](img/choropleth_workingFull.svg)

**Note that Vega-Lite by default removes records with null values.**

(In this case we would like to show countries that do not have values in the Gap Minder dataset)

To show the null values you must add in the following `config`:

```
  "config": {
    "mark": {"invalid": null}
  }
```

We also want to show the null values as our own color of our choosing,
so we add a conditional to explicitly set the color:

```
{ "condition": {
    "test": { not: "isDefined(datum.mapValue)" },
    "value": "darkgrey"
}
```

## Further Reading

If you'd like to explore more (such as how we could validate some of the assumptions - like missing data),
see the {@tutorial vega_choroplethLong} tutorial.
