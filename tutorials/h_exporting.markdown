**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/h_exporting.ipynb)**

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



```javascript
utils = require('jupyter-ijavascript-utils');
['utils'];
```




    [ 'utils' ]



# Accessing a Sample Dataset

The Vega team has a [Sample Datasets library](https://www.npmjs.com/package/vega-datasets)

The jupyter-ijavascript-utils library references it, so you can get sample data quickly.

We can see the list of the datasets available:
utils.datasets.list()

// [
//   'annual-precip.json',
//   'anscombe.json',
//   'barley.json',
//   'budget.json',
//   'budgets.json',
//   'burtin.json',
//   ...
// ]
The DataSet we want is the [facinating GapMinder Life Expectancy study](https://www.gapminder.org/answers/how-does-income-relate-to-life-expectancy/)


```javascript
$$.async()
utils.datasets.fetch('gapminder.json')
.then(data => {
	gapMinder = data;
	$$.sendResult(`captured gap minder records: ${gapMinder.length}`);
});

// 'captured gap minder records: 693'
```




    'captured gap minder records: 693'



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
See the [ijs.await()](https://jupyter-ijavascript-utils.onrender.com/module-ijs.html#.await) docs for more.

# Understanding the Data

One option to understand the kinds of data is to always look at the first record:


```javascript
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




    {
      year: 1955,
      country: 'Afghanistan',
      cluster: 0,
      pop: 8891209,
      life_expect: 30.332,
      fertility: 7.7
    }



# Render as a Table

We can simply render this dataset through the command:

`utils.table(objectCollection).render()`

The [TableGenerator#render](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#render) will generate the HTML and then send it to the browser to render it.


```javascript
utils.table(gapMinder)
    .limit(3)
    .render()
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>pop</th>
	<th>life_expect</th>
	<th>fertility</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
</tr>
</table>



# Filtering Data

You can filter results similar to the [Array.filter() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)


```javascript
utils.table(gapMinder)
    .filter((r) => r.country === 'Afghanistan')
    .render()
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>pop</th>
	<th>life_expect</th>
	<th>fertility</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
</tr>
<tr >
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
</tr>
<tr >
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
</tr>
<tr >
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
</tr>
<tr >
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
</tr>
<tr >
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
</tr>
</table>



## Rendering groups of data

This also works with groups to find a particular list.

I think I'm quite interested to see how the data looks for Afghanistan.

Lets use the [utils.table() or TableGenerator()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html)
to make this easier to see.


```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
)
  .render()
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>pop</th>
	<th>life_expect</th>
	<th>fertility</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
</tr>
<tr >
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
</tr>
<tr >
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
</tr>
<tr >
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
</tr>
<tr >
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
</tr>
<tr >
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
</tr>
</table>



![Screenshot of render table](../img/gapMinderAfghanistanTable.png)

## Styling a Table

Note that we can style the table if we'd like to show when the life expectancy rises above 40 years of age

* [styleRow()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#styleRow)
* [styleCell()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#styleCell)


```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )
  .styleRow(({ record:r }) => r.life_expect > 40 ? 'background-color: #AAA' : '')
  .styleCell(({ record, columnIndex }) =>
        record.life_expect > 40 && columnIndex === 3 ? 'background-color: #AFA' : '')
  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>pop</th>
	<th>life_expect</th>
	<th>fertility</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
</tr>
<tr style="background-color: #AAA;">
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td style="background-color: #AFA;">13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
</tr>
<tr style="background-color: #AAA;">
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td style="background-color: #AFA;">14,669,339</td>
	<td >41.674</td>
	<td >8</td>
</tr>
<tr style="background-color: #AAA;">
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td style="background-color: #AFA;">20,881,480</td>
	<td >41.763</td>
	<td >8</td>
</tr>
<tr style="background-color: #AAA;">
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td style="background-color: #AFA;">23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
</tr>
<tr style="background-color: #AAA;">
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td style="background-color: #AFA;">29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
</tr>
</table>



![Screenshot of styling a table](../img/gapMinderAfghanistanStyleTable.png)

## Adjusting the Table

While the table is helpful, lets clean it up a bit:

* hide the cluster column
* add in a new column for the continent
* make the year render as a string - ex: 1966

We'll do this through
* [data()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#data)
* [augment()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#augment)
* [labels()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#labels)
* [formatter()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#formatter)
* [columnsToExclude()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#columnsToExclude)


```javascript
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
```




    Map(6) {
      0 => { id: 0, continent: 'South Asia' },
      1 => { id: 1, continent: 'Europe & Central Asias' },
      2 => { id: 2, continent: 'Sub-Saharan Africa' },
      3 => { id: 3, continent: 'Americas' },
      4 => { id: 4, continent: 'East Asia & Pacific' },
      5 => { id: 5, continent: 'Middle East & North Africa' }
    }



## First, lets augment the data with the continent

Any properties passed in the object to augment, are appended to the dataset (non-mutating)


```javascript
utils.table(gapMinder)
  .filter((r) => r.country === 'Afghanistan')

  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>pop</th>
	<th>life_expect</th>
	<th>fertility</th>
	<th>continent</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
	<td >South Asia</td>
</tr>
</table>



## Column Labels

The columns are the names of the properties on the objects by default.

We can change that by calling [labels()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#labels)

Use an object to map the property name to a string of what the Column Header should be.


```javascript
utils.table(gapMinder)
  .filter((r) => r.country === 'Afghanistan')

  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})

  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>population</th>
	<th>life expectancy</th>
	<th>fertility</th>
	<th>continent</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
	<td >South Asia</td>
</tr>
</table>



## Formatting Columns

If we want to change how certain columns are rendered (such as avoiding columns for years)

We can use the [formatter() method](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#formatter)
                                    
Similar to the Augment method, all the properties passed on the object are passed to a function to format before printing.


```javascript
utils.table(gapMinder)
  .filter((r) => r.country === 'Afghanistan')

  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})

  //-- format a specific value, say a year to a String
  .formatter({
    // property: formattingFunction
    life_expect: (val) => String(val),
    
    //-- alternatively, you can convert to 'Number', 'String' or 'Boolean'
    year: 'string'
  })

  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>cluster</th>
	<th>population</th>
	<th>life expectancy</th>
	<th>fertility</th>
	<th>continent</th>
</tr>
<tr >
	<td >1955</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1960</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1965</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1970</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1975</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1980</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1985</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1990</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1995</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2000</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2005</td>
	<td >Afghanistan</td>
	<td >0</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
	<td >South Asia</td>
</tr>
</table>



## Specifying Columns

There are a few options to specifying which columns to show, or not, and the order.

In this example, we can simply keep all the columns - but not show one column in particular:

[columnsToExclude()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#columnsToExclude)


```javascript


utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )


  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})



  //-- explicitly exclude a specific column
  .columnsToExclude(['cluster'])

  //-- or you could explicitly set the columns and order
  // .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])

  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>country</th>
	<th>population</th>
	<th>life expectancy</th>
	<th>fertility</th>
	<th>continent</th>
</tr>
<tr >
	<td >1,955</td>
	<td >Afghanistan</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,960</td>
	<td >Afghanistan</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,965</td>
	<td >Afghanistan</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,970</td>
	<td >Afghanistan</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,975</td>
	<td >Afghanistan</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,980</td>
	<td >Afghanistan</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,985</td>
	<td >Afghanistan</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,990</td>
	<td >Afghanistan</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >1,995</td>
	<td >Afghanistan</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,000</td>
	<td >Afghanistan</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
	<td >South Asia</td>
</tr>
<tr >
	<td >2,005</td>
	<td >Afghanistan</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
	<td >South Asia</td>
</tr>
</table>



**Alternatively**, you can specify only the columns to show and the order will be preserved


```javascript
JSON.stringify(utils.object.keys(gapMinder));
// "year","country","cluster","pop","life_expect","fertility","continent"
```




    '["year","country","cluster","pop","life_expect","fertility"]'




```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )


  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})



  //-- explicitly exclude a specific column
  //.columnsToExclude(['cluster'])
  //-- or you could explicitly set the columns and order
  .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])

  .render();
```




<table cellspacing="0px" >
<tr >
	<th>year</th>
	<th>continent</th>
	<th>country</th>
	<th>population</th>
	<th>life expectancy</th>
	<th>fertility</th>
</tr>
<tr >
	<td >1,955</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >8,891,209</td>
	<td >30.332</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,960</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >9,829,450</td>
	<td >31.997</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,965</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >10,997,885</td>
	<td >34.02</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,970</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >12,430,623</td>
	<td >36.088</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,975</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >14,132,019</td>
	<td >38.438</td>
	<td >7.7</td>
</tr>
<tr >
	<td >1,980</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >15,112,149</td>
	<td >39.854</td>
	<td >7.8</td>
</tr>
<tr >
	<td >1,985</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >13,796,928</td>
	<td >40.822</td>
	<td >7.9</td>
</tr>
<tr >
	<td >1,990</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >14,669,339</td>
	<td >41.674</td>
	<td >8</td>
</tr>
<tr >
	<td >1,995</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >20,881,480</td>
	<td >41.763</td>
	<td >8</td>
</tr>
<tr >
	<td >2,000</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >23,898,198</td>
	<td >42.129</td>
	<td >7.479</td>
</tr>
<tr >
	<td >2,005</td>
	<td >South Asia</td>
	<td >Afghanistan</td>
	<td >29,928,987</td>
	<td >43.828</td>
	<td >7.069</td>
</tr>
</table>



# Exporting to different types of data

Note that there are a few other types of output, such as:

* [generateHTML()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateHTML)
* [generateCSV()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateCSV)
* [generateMarkdown()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateMarkdown)

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

## Markdown

To render as Markdown, simply finish with the [renderMarkdown()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#renderMarkdown) method

Note that this has an accompanying method: [generateMarkdown()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateMarkdown)


```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )

  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  .limit(3)

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})

  //-- format a specific value, say a year to a String
  .formatter({
    // property: formattingFunction
    life_expect: (val) => String(val),
    
    //-- alternatively, you can convert to 'Number', 'String' or 'Boolean'
    year: 'string'
  })

  //-- explicitly exclude a specific column
  .columnsToExclude(['cluster'])

  //-- or you could explicitly set the columns and order
  // .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])

  .renderMarkdown();
```

    year|country    |population|life expectancy|fertility|continent 
    --  |--         |--        |--             |--       |--        
    1955|Afghanistan|8,891,209 |30.332         |7.7      |South Asia
    1960|Afghanistan|9,829,450 |31.997         |7.7      |South Asia
    1965|Afghanistan|10,997,885|34.02          |7.7      |South Asia


year|country    |population|life expectancy|fertility|continent 
--  |--         |--        |--             |--       |--        
1955|Afghanistan|8,891,209 |30.332         |7.7      |South Asia
1960|Afghanistan|9,829,450 |31.997         |7.7      |South Asia
1965|Afghanistan|10,997,885|34.02          |7.7      |South Asia

## Render as CSV

To render as Markdown, simply finish with the [renderCSV()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#renderCSV) method

Note that this has an accompanying method: [generateCSV()](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateCSV)


```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )

  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  .limit(3)

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})

  //-- format a specific value, say a year to a String
  .formatter({
    // property: formattingFunction
    life_expect: (val) => String(val),
    
    //-- alternatively, you can convert to 'Number', 'String' or 'Boolean'
    year: 'string'
  })

  //-- explicitly exclude a specific column
  .columnsToExclude(['cluster'])

  //-- or you could explicitly set the columns and order
  // .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])

  .renderCSV();
```

    "year","country","population","life expectancy","fertility","continent"
    "1955","Afghanistan","8,891,209","30.332","7.7","South Asia"
    "1960","Afghanistan","9,829,450","31.997","7.7","South Asia"
    "1965","Afghanistan","10,997,885","34.02","7.7","South Asia"


## Generate Array

If you want the results, so you can do further operations, use the [generateArray](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateArray) method.

(It is safe to ignore the legacy [generateArray](https://jupyter-ijavascript-utils.onrender.com/TableGenerator.html#generateArray), as it will be removed in future versions)


```javascript
utils.table(
    utils.group.by(gapMinder, 'country').get('Afghanistan')
  )

  //-- add new field / column
  .augment({
    continent: (r) => clusterMap.get(r.cluster).continent
  })

  .limit(3)

  //-- labels (property: label name)
  .labels({ pop: 'population', life_expect: 'life expectancy'})

  //-- format a specific value, say a year to a String
  .formatter({
    // property: formattingFunction
    life_expect: (val) => String(val),
    
    //-- alternatively, you can convert to 'Number', 'String' or 'Boolean'
    year: 'string'
  })

  //-- explicitly exclude a specific column
  .columnsToExclude(['cluster'])

  //-- or you could explicitly set the columns and order
  // .columns(['year', 'continent', 'country', 'pop', 'life_expect', 'fertility'])

  .generateArray2();
```




    [
      [
        'year',
        'country',
        'population',
        'life expectancy',
        'fertility',
        'continent'
      ],
      [ '1955', 'Afghanistan', 8891209, '30.332', 7.7, 'South Asia' ],
      [ '1960', 'Afghanistan', 9829450, '31.997', 7.7, 'South Asia' ],
      [ '1965', 'Afghanistan', 10997885, '34.02', 7.7, 'South Asia' ]
    ]


