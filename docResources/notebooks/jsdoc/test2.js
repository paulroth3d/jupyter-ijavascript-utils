utils = require('jupyter-ijavascript-utils');

jsonPath = './jsdoc.json';
jsonData = utils.file.readJSON(jsonPath);

top10 = jsonData.filter(r => r.undocumented !== true).slice(0, 10);

console.log(utils.table(top10).generateMarkdown());
