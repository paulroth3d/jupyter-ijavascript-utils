**[This walkthrough is also available as a Jupyter ipynb Notebook - you can run yourself](notebooks/ex_GettingData.ipynb)**

A frequent question asked is: 'How do I get data?'

Importantly, **we are just working with NodeJS**<br />
albeit within the context within a Jupyter Lab Notebook.

So essentially, any data that you can programmatically access with an [NPM module](https://www.npmjs.com/search?q=keywords:file) is available within a Jupyter Lab notebook.

Example Data Sources:
* Local Files
* APIs and Cloud Services
* Scraping
* Generating
* etc.

## Note on Asynchronous Calls

[TODO]

We would recommend [using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
and using [await / asynchronous functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

We provide the [utils.ijs.await function](https://jupyter-ijavascript-utils.onrender.com/module-ijs.html#.await)
to provide await functionality within the iJavaScript kernel,
so the next cell will only be executed once the asynchronous calls are done.

This allows for very simple chaining of asynchronous and synchronous calls.

Please [give it a look](https://jupyter-ijavascript-utils.onrender.com/module-ijs.html#.await)

For example:

```
//-- get the data
//-- fetch the data
//-- and do not execute the next cell until received.
utils.ijs.await(async ($$, console) => {
 barley = await utils.datasets.fetch('barley.json');
})
```

```
//-- use the data as though it was synchronously received

//-- get the min max of the types of barley
barleyByVarietySite = d3.group(barley, d => d.variety, d => d.site)
//-- now group by variety and year
barleyByVarietyYear = d3.group(barley, d => d.variety, d => d.year)
```

## Library Setup


```javascript
//-- this library
utils = require('jupyter-ijavascript-utils');
//-- library for parsing and manipulating html (like from fetch)
cheerio = require('cheerio');
//-- data-driven-documents (d3) library - allows for TSV/CSV/etc. files
d3 = require('d3');
//-- library for working with secrets locally
dotenv = require('dotenv');
['utils', 'cheerio', 'd3', 'dotenv'];
```




    [ 'utils', 'cheerio', 'd3', 'dotenv' ]



# Local Files

While there are many NPM modules available for loading data, we have tried to simplify two main types of files:
* [utils.file.readFile(path)](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.readFile) - to read in Text
* [utils.file.readJSON(path)](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.readJSON) - to read in a file and parse as JSON

Including functions to write files as-well.

* [utils.file.writeFile(path, stringContents)](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.readFile) - to read in Text
* [utils.file.readJSON(path, stringContents)](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.readJSON) - to read in a file and parse as JSON

There are many NPM Modules available for loading different kinds of files.

The jupyter-ijavascript-utils library includes a few simple functions - for requent situations.

* [utils.file.pwd](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.pwd) - prints the current directory Jupyter Lab is looking at
utils.file.pwd()
// /path/to/notebooks
* [utils.file.listFiles](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.listFiles) - to list the files in a directory
utils.file.listFiles('.');

/*
[
  'ex_GettingData.ipynb',
  'node_modules',
  'package-lock.json',
  'package.json',
  ...
]
*/
* [utils.file.checkFile](https://jupyter-ijavascript-utils.onrender.com/module-file.html#.checkFile) - to return true if a file already exists.

**FOR EXAMPLE: checking if your [dotenv credentials]() can be found**

```
credentialsPath = `${utils.file.pwd()}/credentials.env`;

if (utils.file.checkFile('./credentials.env')) {
    //-- credentials could not be found
    //-- let the user know what is expected
    
    console.error(`Could not find ${credentialsPath}

We use dotenv to securely store credentials
and require it to access provider XYZ.

* username {string}
* password {string}

for example:

"""
username="jdoe@example.com"
password=""
"""

Please create this file and run again.
`);
    throw Error(`credentials file not found:${credentialsPath}\nPlease read the message above and try again`);
    
    
} else {
    //-- the credentials file was found, so load it
    credentials = dotenv.config({ path: credentialsPath }).parsed;
}

//-- check we have all the information needed to move forward

if (!credentials.username || !credentials.password) {
    throw Error(`Credentials not provided
${credentialsPath}`);
}

//-- indicate success
//-- BUT always be careful NOT TO leak credentials
console.log(`credentials loaded`);
```


# APIs and Cloud Services

[TODO]

Remember, we are still using NodeJS - so you can leverage NPM packages to load data.

For example:

[JSForce](https://jsforce.github.io/) is a brilliant library for working with Salesforce.


## Working with Secrets

[TODO]

Working with Secrets in a jupyter notebook is similar to working with any NodeJS project.

[Dotenv](https://www.npmjs.com/package/dotenv) is a staple for working with credentials and highly recommended.

Remember though:
* DO NOT include credentials within any notebook
* If using dotenv, ensure the files are properly secured (as they are outside of the notebook)
    * For example, that they are gitignored, have appropriate read access, etc.
* As a notebook can provide summaries of data accessed through secure means, always protect the notebook as-well.
    * To avoid any security leaks

## Database Access

[TODO]

As we are working within NodeJS, there are many NPM libraries that can help with accessing databases.

For example: [sequelize](https://www.npmjs.com/package/sequelize) is an Sequelize is a promise-based Node.js ORM tool for Postgres, MySQL, MariaDB, SQLite, DB2 and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

And of course the native database libraries can be used:
* [utils.datasets.fetchJSON](http://localhost:8080/module-datasets.html#.fetchJSON)
* [utils.datasets.fetchText](http://localhost:8080/module-datasets.html#.fetchText)
* etc.

Of course, the native libraries can always be used:
* [mssql](https://www.npmjs.com/package/mssql) - for working with sql server
* [mysql](https://www.npmjs.com/package/mysql) for working with mysql

# Scraping

[TODO]

Scraping (retrieving through [fetch](), parsing and collating) can be done within a Jupyter Notebook.

We would recommend to keeping this to simple fetches and parsing in general however.

This jupyter-ijavascript-utils library includes two convenience functions for working with [fetch](https://www.npmjs.com/package/node-fetch),
a simple shim for traditional [JavaScript fetch calls](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) from within node.
                                                       
Additional libraries can also be used to parse the data and generate datasets
                             
(For example: [cheerio](https://www.npmjs.com/package/cheerio-select))

## Working with Text Files

[TODO]

You can also work with Text files and use it based on the current path:

There are also many many different ways to do this.

```
sillySong = utils.file.load('../data/pirates.txt');

sillySong.split(/\n[ \t]*\n/)        // split on multiple line breaks
  .map(stanza => stanza.split(/\n/)  // split lines by newline
    .map(line => line.trim())        // trim each line
  );
sillySong[0][0]; // I am the very model of a modern Major-General,
```

# Generating

[TODO]

Generating Data can also be a simple option if desired.

We have two sets of methods on the [random module](https://jupyter-ijavascript-utils.onrender.com/module-random.html)

-   Generating Random Numbers
    -   [randomInteger(min, max)](https://jupyter-ijavascript-utils.onrender.com/module-random.html#.randomInteger) - inclusive integer between min and max values
    -   [randomInteger(min, max)](https://jupyter-ijavascript-utils.onrender.com/module-random.html#.random) - inclusive float between min and max values
-   Working with Arrays
    -   [pickRandom(array)](https://jupyter-ijavascript-utils.onrender.com/module-random.html#.pickRandom) - picks a value at random from the list
    -   [randomArray(size, fn)](https://jupyter-ijavascript-utils.onrender.com/module-random.html#.randomArray) - creates an array of size length, with each value generated from fn
-   Simplex Noise
    -   simplexGenerator(seed) - Number generator between -1 and 1 given an x/y/z coordinate

Additionally, there are so many different ways of generating visualizations
based on simplex noise.

From straight (red - negative / green - positive)

![Screenshot of animation](img/simplexNoiseAnim.gif)

To indicators with length, and rotation (negative ccw / positive cw)

![Screenshot of animation](img/noiseFinal.gif)
