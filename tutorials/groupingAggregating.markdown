
# Grouping and Exploring with Jupyter-iJavaScript-Utils

As with many of the tutorials we show here, many leverage the wonderful [vega datasets](https://github.com/vega/vega-datasets), understanding the data is a crucial first step in helping to explain it to others.

Once you have the data, we provide a few additional tools you can use:

* [Generate a Schema](https://jupyter-ijavascript-utils.onrender.com/module-object.html#.generateSchema) for your array
* [Get the Object Property Types](https://jupyter-ijavascript-utils.onrender.com/module-object.html#.getObjectPropertyTypes) for your array

```
utils.object.generateSchema(weather)
// {
//   "$schema": "http://json-schema.org/draft-04/schema#",
//   "type": "array",
//   "items": {
//     "type": "object",
//     "properties": {
//       "id": {
//         "type": "number"
//       },
//       "city": {
//         "type": "string"
//       },
//       "month": {
//         "type": "string"
//       },
//       "precip": {
//         "type": "number"
//       }
//     },
//     "required": [
//       "id",
//       "city",
//       "month",
//       "precip"
//     ]
//   }
// }
```

## Grouping

Additionally, grouping can be crucial in understanding the true shape of your data.

For example:

```
initializeWeather = () => [
  { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
  { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
  { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
  { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
  { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
  { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
  { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
  { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
  { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
];
weather = initializeWeather();
```

We can then identify which records belong to which city by the `group by` function:

```
utils.group.by(weather, 'city')
```

```
// SourceMap(3) [Map] {
//   'Seattle' => [
//     { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
//     { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
//     { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
//  ],
//   'New York' => [
//     { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
//    { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
//     { id: 5, city: 'New York', month: 'Dec', precip: 3.58 }
//   ],
//   'Chicago' => [
//     { id: 6, city: 'Chicago', month: 'Apr', precip: 3.62 },
//     { id: 8, city: 'Chicago', month: 'Dec', precip: 2.56 },
//     { id: 7, city: 'Chicago', month: 'Aug', precip: 3.98 }
//   ],
//   source: 'city'
// }
```

You can then access those records based on the map index:

```
utils.group.by(weather, 'city')['Seattle'];

// [
//     { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
//     { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
//     { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
// ]
```

You can even group by multiple groups to get more fine grained collections:

```
utils.group.by(weather, 'month', 'city')

// provides:
// SourceMap(3) [Map] {
//   'Aug' => SourceMap(3) [Map] {
//     "Seattle" => [{ "id": 1, "city": "Seattle", "month": "Aug", "precip": 0.87 }]
//     "New York" => [{"id": 4, "city": "New York", "month": "Aug", "precip": 4.13}]
//     "Chicago" => [{"id": 7, "city": "Chicago", "month": "Aug", "precip": 3.98}]
//     source: 'city'
//   },
//   'Apr' => SourceMap(3) [Map] {
//     "Seattle" => [{"id": 0, "city": "Seattle", "month": "Apr", "precip": 2.68}]
//     "New York" => [{"id": 3, "city": "New York", "month": "Apr", "precip": 3.94}]
//     "Chicago" => [{"id": 6, "city": "Chicago", "month": "Apr", "precip": 3.62}]
//     source: 'city'
//   },
//   'Dec' => SourceMap(3) [Map] {
//     "Seattle" => [{"id": 2, "city": "Seattle", "month": "Dec", "precip": 5.31}]
//     "New York" => [{"id": 5, "city": "New York", "month": "Dec", "precip": 3.58}]
//     "Chicago" => [{"id": 8, "city": "Chicago", "month": "Dec", "precip": 2.56}]
//     source: 'city'
//   },
//   source: 'month'
// }
```

(see the [Group By module](https://jupyter-ijavascript-utils.onrender.com/module-group.html) for more)

## Aggregating

You can also aggregate the entire collection:

```
utils.aggregate.unique(weather, 'city');
// [ 'Seattle', 'New York', 'Chicago' ]
```

Or reduce after grouping

```
utils.group.by(weather, 'city')
    .reduce((group) => ({
      min: utils.agg.min(group, 'precip'),
      max: utils.agg.max(group, 'precip'),
      avg: utils.agg.avgMean(group, 'precip')
    }));

// [
//   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953333333333333 },
//   { city: 'New York', min: 3.58, max: 4.13, avg: 3.8833333333333333 },
//   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.3866666666666667 }
// ]
```

Even rolling your own if you would prefer:

```
utils.group.rollup(weather, r => r.length, 'city', 'year')

//  SourceMap(3) [Map] {
//   'Seattle' => SourceMap(2) [Map] { 2020 => 2, 2021 => 1, source: 'year' },
//   'New York' => SourceMap(2) [Map] { 2021 => 1, 2020 => 2, source: 'year' },
//   'Chicago' => SourceMap(2) [Map] { 2021 => 1, 2020 => 2, source: 'year' },
//   source: 'city'
// }
```

(See the [Aggregate Module for more](https://jupyter-ijavascript-utils.onrender.com/module-aggregate.html))

# Joining data

In addition to aggregating data, we may want to join the data to another dataset, such as through [object.join](https://jupyter-ijavascript-utils.onrender.com/module-object.html#.join)


```javascript
weatherByCity = utils.group.by(weather, 'city')
    .reduce((group) => ({
      min: utils.agg.min(group, 'precip'),
      max: utils.agg.max(group, 'precip'),
      avg: utils.agg.avgMean(group, 'precip')
    }));
```




    [
      { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953333333333333 },
      { city: 'New York', min: 3.58, max: 4.13, avg: 3.8833333333333333 },
      { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.3866666666666667 }
    ]




```javascript
cityLocations = [{ city: 'Chicago', state: 'IL', lat: 41.8781, lon: -87.6298 },
                { city: 'New York', state: 'NY', lat: 40.7128, lon: -74.0060 },
                { city: 'Seattle', state: 'WA', lat: 47.6062, lon: -122.3321 }];
```




    [
      { city: 'Chicago', state: 'IL', lat: 41.8781, lon: -87.6298 },
      { city: 'New York', state: 'NY', lat: 40.7128, lon: -74.006 },
      { city: 'Seattle', state: 'WA', lat: 47.6062, lon: -122.3321 }
    ]




```javascript
cityLocationMap = utils.object.mapByProperty(cityLocations, 'city');
```




    Map(3) {
      'Chicago' => { city: 'Chicago', state: 'IL', lat: 41.8781, lon: -87.6298 },
      'New York' => { city: 'New York', state: 'NY', lat: 40.7128, lon: -74.006 },
      'Seattle' => { city: 'Seattle', state: 'WA', lat: 47.6062, lon: -122.3321 }
    }




```javascript
utils.object.joinProperties(weatherByCity, 'city', cityLocationMap, 'state', 'lat', 'lon')

// [
//   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953333333333333, statelat: 47.6062, lon: 122.3321, state: 'WA' },
//   { city: 'New York', min: 3.58, max: 4.13, avg: 3.8833333333333333, lat: 40.7128, lon: 74.006, state: 'NY' },
//   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.3866666666666667, lat: 41.8781, lon: 87.6298, state: 'IL' }
// ]
```




    [
      {
        city: 'Seattle',
        min: 0.87,
        max: 5.31,
        avg: 2.953333333333333,
        state: 'WA',
        lat: 47.6062,
        lon: -122.3321
      },
      {
        city: 'New York',
        min: 3.58,
        max: 4.13,
        avg: 3.8833333333333333,
        state: 'NY',
        lat: 40.7128,
        lon: -74.006
      },
      {
        city: 'Chicago',
        min: 2.56,
        max: 3.98,
        avg: 3.3866666666666667,
        state: 'IL',
        lat: 41.8781,
        lon: -87.6298
      }
    ]



or an alternative using vanilla JavaScript


```javascript
weatherByCity = weatherByCity.map((entry) => {
    const { state, lat, lon } = cityLocationMap.get(entry.city);
    return ({ ...entry, state, lat, lon });
});

// [
//   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953333333333333, lat: 47.6062, lon: 122.3321 },
//   { city: 'New York', min: 3.58, max: 4.13, avg: 3.8833333333333333, lat: 40.7128, lon: 74.006 },
//   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.3866666666666667, lat: 41.8781, lon: 87.6298 }
// ]
```




    [
      {
        city: 'Seattle',
        min: 0.87,
        max: 5.31,
        avg: 2.953333333333333,
        state: 'WA',
        lat: 47.6062,
        lon: -122.3321
      },
      {
        city: 'New York',
        min: 3.58,
        max: 4.13,
        avg: 3.8833333333333333,
        state: 'NY',
        lat: 40.7128,
        lon: -74.006
      },
      {
        city: 'Chicago',
        min: 2.56,
        max: 3.98,
        avg: 3.3866666666666667,
        state: 'IL',
        lat: 41.8781,
        lon: -87.6298
      }
    ]

