This library only intends to ease those getting into Jupyter and Notebooks.

There are many other libraries that go into detail farther than we will want to provide.

If you are just getting started, I might suggest working with [d3 as a swiss army knife of the internet](https://observablehq.com/@d3/d3-group)

If you are more familiar with Pandas and DataFrames, I might suggest {@link https://danfo.jsdata.org/|DanfoJS}

Additionally, if you are looking for number processing at hardware accelerated speeds,
I would suggest reviewing other libraries, such as [ScramJet](https://www.npmjs.com/package/scramjet)
and {@link https://www.npmjs.com/package/numjs | NumJS}

Additionally, {@link https://github.com/stdlib-js/stdlib|StdLib} has some amazing work with hardware acceleration and GPU utilization.

## D3

D3, specifically: [group / rollup](https://observablehq.com/@d3/d3-group) and [flatGroup / flatRollup](https://observablehq.com/@d3/d3-flatgroup)

## DanfoJS
{@link https://danfo.jsdata.org/|DanfoJS} - a js library heavily inspired by
{@link https://pandas.pydata.org/pandas-docs/stable/index.html|Pandas}
so someone familiar with Pandas can get up to speed very quickly

## DataFrame-JS
{@link https://gmousse.gitbooks.io/dataframe-js/|dataframe-js} -
provides an immutable data structure for DataFrames
which allows to work on rows and columns with a sql
and functional programming inspired api.

## StandardLib
{@link https://github.com/stdlib-js/stdlib|StdLib} - 
is a great library that compiles down to C/C++ level to providespeeds comparable to Numpy.

## NumJS
{@link https://www.npmjs.com/package/numjs | NumJS}
is also a great number processing library.
It may not be as fast as StdLib, but it can sometimes be easier touse.
