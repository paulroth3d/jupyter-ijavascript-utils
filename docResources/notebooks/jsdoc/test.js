#!/Users/proth/.nvm/versions/node/v16.14.2/bin/node

console.log('trying out jsdoc-api');
const jsdoc = require('jsdoc-api');
const utils = require('jupyter-ijavascript-utils');

let targetPath = '../../../src/**.js';

console.log(process.argv);

let output;

// const output = jsdoc.explainSync({ source: '/** example doclet */ \n const example = true' });

output = jsdoc.explainSync({ files: '../../../src/**.js' });

console.log(JSON.stringify(output));

utils.file.writeJSON('./jsdoc.json', output);
