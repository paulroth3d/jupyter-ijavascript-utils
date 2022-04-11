const DatasetsObj = {
  reset: () => {
    DatasetsObj['movies.json'].mockReset();
    DatasetsObj.list = jest.fn();
  },
  list: jest.fn().mock,
  'movies.json': jest.fn()
};

module.exports = DatasetsObj;
