To use this library, simply npm install the library in the same folder you launch Jupyter Lab.

```
npm install --save jupyter-ijavascript-utils
```

Once you launch jupyter (ex: through `jupyter lab`),
as long as the `npm_modules` folder is accessible in that folder,
then the modules installed will also be accessible within JavaScript enabled notebook.

![Screenshot of Jupyter with a require](img/howToUse_require.png)

Note that Jupyter executes cells in order from top to bottom.

So any cells below the cells below can then use the library.

## What is Jupyter Anyway?

[Jupyter or Jupyter Lab - the latest environment](https://jupyter.org/) is a web-based interactive development environment.

It has a very flexible interface to support workflows in data science, scientific computing, computational journalism and machine learning.

Each cell can either include either readible text or code (and/or its output), making it a wonderful way to explore and express ideas quickly.

![Screenshot of a cell setting a value, and then printing it in markdown](img/howToUse_cellsBuilding.png)

Visual Studio Code also supports Jupyter Notebooks natively now too - [learn more here](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

**Please note that it does not yet support different types of rendering, such as svg or html - used for TableGenerator and Vega ouputs**

## Installing Jupyter

You can try Jupyter yourself in your browser 

* [Try Jupyter in your Browser](https://jupyter.org/try)

However, the simplest option for people just getting started is through [Anaconda](https://www.anaconda.com/)

The Individual Edition is free and manages versions of Python and Jupyter Lab for you.

However, if you already are managing python versions, [Jupyter Lab can be installed directly through pip](https://jupyter.org/install)

## What is the iJavaScript Kernel

Jupyter supports multiple languages, but JavaScript is not available out of the box.

[Try Jupyter Lab in your browser for the languages that are supported natively](https://jupyter.org/try)

Language support is provided through Kernels within Jupyter Lab.

[iJavaScript by nriesco](http://n-riesco.github.io/ijavascript/) is a kernel that provides JavaScript support
through a Node.js session, and quite a few other smart ideas (such as Promise and Async support), along with various types of output options.

## Installing iJavaScript Kernel

The installation for iJavaScript kernel depends on Node.js, npm and Jupyter.

The steps and other details [can be found here](https://n-riesco.github.io/ijavascript/doc/install.md.html)

Note that typically for mac, this can be as simple as:

```
npm install -g ijavascript
ijsinstall 
```

Note: I tend to run `ijsinstall --spec-path=full` to ensure the kernel uses the full path, to avoid issues

## FAQ

TODO