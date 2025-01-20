# Generating Tables

[todo]

Use tables to:

* filter
* sort
* highlight rows / columns / style entire table
* add columns
* format data
* export to different types of formats:
    * html
    * markdown
    * csv
    * array

---

# Accessing a Sample Dataset

The Vega team has a [Sample Datasets library](https://www.npmjs.com/package/vega-datasets)

The jupyter-ijavascript-utils library references it, so you can get sample data quickly.

We can see the list of the datasets available:

```
utils.datasets.list();

// [
//   'annual-precip.json',
//   'anscombe.json',
//   'barley.json',
//   'budget.json',
//   'budgets.json',
//   'burtin.json',
//   ...
// ]
```

The DataSet we want is the [facinating GapMinder Life Expectancy study](https://www.gapminder.org/answers/how-does-income-relate-to-life-expectancy/)

```
$$.async()
utils.datasets.fetch('gapminder.json')
.then(data => {
	gapMinder = data;
	$$.sendResult(`captured gap minder records: ${gapMinder.length}`);
});

// 'captured gap minder records: 693'
```

As we called `$$.async()` - the cell knows that it should pause execution for the next cell until `$$.sendResult(...)` is called.

**Note** - the `utils.ijs.await` method available in the library can simplify this call, to support await.

```
//-- does the same thing as the cell above
utils.ijs.await(async ($$, console) => {
	gapMinder = await utils.datasets.fetch('gapminder.json');
    return `captured gap minder records: ${gapMinder.length}`;
});

// 'captured gap minder records: 693'
```

See the {@link module:ijs.await|ijs.await()} docs for more.

# Understanding the Data

One option to understand the kinds of data is to always look at the first record:

```
gapMinder[0];

// gives:
// {
//   year: 1955,
//   country: 'Afghanistan',
//   cluster: 0,
//   pop: 8891209,
//   life_expect: 30.332,
//   fertility: 7.7
// }
```

The Utilities also include two additional methods that can help:

{@link module:object.generateSchema|object.generateSchema(object | array)}

This generates a schema of all objects in the collection, 
and of the objects those contain (deep introspection),

It tells us that there are no objects further down with additional fields, and all the fields are always populated.

But this can leave a bit to be desired for the types of properties.

```
// {
//   '$schema': 'http://json-schema.org/draft-04/schema#',
//   type: 'array',
//   items: {
//     type: 'object',
//     properties: {
//       year: [Object],
//       country: [Object],
//       cluster: [Object],
//       pop: [Object],
//       life_expect: [Object],
//       fertility: [Object]
//     },
//     required: [ 'year', 'country', 'cluster', 'pop', 'life_expect', 'fertility' ]
//   }
// }
```

{@link module:object.getObjectPropertyTypes|object.getObjectPropertyTypes(object / array)}

This identifies the types of properties much clearer,
but only of the objects in the collection (shallow introspection).

```
utils.object.getObjectPropertyTypes(gapMinder)

// returns
// Map(2) {
//   'number' => Set(5) { 'year', 'cluster', 'pop', 'life_expect','fertility' },
//   'string' => Set(1) { 'country' }
// }
```


I think I'm quite interested to see how the data looks for Afghanistan.

Lets use the {@link TableGenerator} to make this easier to see.

```
new utils.TableGenerator()
  .data(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )
  .render()
```

The {@link TableGenerator#render} will render the results right out to the Jupyter Notebook (generate as html and display it)

![Screenshot of render table](img/gapMinderAfghanistanTable.png)

Note that there are a few other types of output, such as:

* {@link TableGenerator#generateHTML|generateHTML()}
* {@link TableGenerator#generateCSV|generateCSV()}
* {@link TableGenerator#generateMarkdown|generateMarkdown()}

Like the Markdown table shown here:

year |country    |cluster|pop       |life_expect|fertility
--   |--         |--     |--        |--         |--       
1,955|Afghanistan|0      |8,891,209 |30.332     |7.7      
1,960|Afghanistan|0      |9,829,450 |31.997     |7.7      
1,965|Afghanistan|0      |10,997,885|34.02      |7.7      
1,970|Afghanistan|0      |12,430,623|36.088     |7.7      
1,975|Afghanistan|0      |14,132,019|38.438     |7.7      
1,980|Afghanistan|0      |15,112,149|39.854     |7.8      
1,985|Afghanistan|0      |13,796,928|40.822     |7.9      
1,990|Afghanistan|0      |14,669,339|41.674     |8        
1,995|Afghanistan|0      |20,881,480|41.763     |8        
2,000|Afghanistan|0      |23,898,198|42.129     |7.479    
2,005|Afghanistan|0      |29,928,987|43.828     |7.069 

## Styling a Table

Note that we can style the table if we'd like to show when the life expectancy rises above 40 years of age

* {@link TableGenerator#styleRow}
* {@link TableGenerator#styleCell}

```
new utils.TableGenerator()
  .data(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )
  .styleRow(({ record:r }) => r.life_expect > 40 ? 'background-color: #AAA' : '')
  .styleCell(({ record, columnIndex }) =>
        record.life_expect > 40 && columnIndex === 3 ? 'background-color: #AFA' : '')
  .render();
```

![Screenshot of styling a table](img/gapMinderAfghanistanStyleTable.png)

## Adjusting the Table

While the table is helpful, lets clean it up a bit:

* hide the cluster column
* add in a new column for the continent
* make the year render as a string - ex: 1966

We'll do this through
* {@link TableGenerator#data}
* {@link TableGenerator#augment}
* {@link TableGenerator#labels}
* {@link TableGenerator#formatter}
* {@link TableGenerator#columnsToExclude}

```
continents = [
  { id: 0, continent: 'South Asia' },
  { id: 1, continent: 'Europe & Central Asias' },
  { id: 2, continent: 'Sub-Saharan Africa' },
  { id: 3, continent: 'Americas' },
  { id: 4, continent: 'East Asia & Pacific' },
  { id: 5, continent: 'Middle East & North Africa' }
];
clusterMap = utils.group.index(continents, 'id');
// map of contents with the id field as the key

new utils.TableGenerator()
  .data(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )
  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })
  //-- labels
  .labels({ pop: 'population', life_expect: 'life expectancy'})
  //-- format a specific value, say a year to a String
  .formatter({
    year: (val) => String(val)
  })
  .columnsToExclude(['cluster'])
  //-- or you could explicitly set the columns and order
  // .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])
  .render();
```

year|country    |population|life expectancy|fertility|continent 
--  |--         |--        |--             |--       |--        
1955|Afghanistan|8,891,209 |30.332         |7.7      |South Asia
1960|Afghanistan|9,829,450 |31.997         |7.7      |South Asia
1965|Afghanistan|10,997,885|34.02          |7.7      |South Asia
1970|Afghanistan|12,430,623|36.088         |7.7      |South Asia
1975|Afghanistan|14,132,019|38.438         |7.7      |South Asia
1980|Afghanistan|15,112,149|39.854         |7.8      |South Asia
1985|Afghanistan|13,796,928|40.822         |7.9      |South Asia
1990|Afghanistan|14,669,339|41.674         |8        |South Asia
1995|Afghanistan|20,881,480|41.763         |8        |South Asia
2000|Afghanistan|23,898,198|42.129         |7.479    |South Asia
2005|Afghanistan|29,928,987|43.828         |7.069    |South Asia

# Bake in the Continent

To avoid constantly mapping the continent, lets just bake the continent right into the record.

* {@link module:group.index|see group.index(collection, field) for more}
* {@link module:object.augment|see object.augment(collection, fn) for more}

```
continents = [
  { id: 0, continent: 'South Asia' },
  { id: 1, continent: 'Europe & Central Asias' },
  { id: 2, continent: 'Sub-Saharan Africa' },
  { id: 3, continent: 'Americas' },
  { id: 4, continent: 'East Asia & Pacific' },
  { id: 5, continent: 'Middle East & North Africa' }
];

clusterMap = utils.group.index(continents, 'id');
// map of contents with the id field as the key

//-- overwrite with an immutible update
gapMinder = utils.object.augment(gapMinder, (record) => ({
  continent: clusterMap.get(record.cluster).continent
}));
```

alternatively, you can write in place

```
//-- does the same thing 
utils.object.augment(gapMinder, (record) => ({
  continent: clusterMap.get(record.cluster).continent
}), true);
```
