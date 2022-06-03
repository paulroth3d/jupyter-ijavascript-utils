/* eslint-disable max-len, array-bracket-spacing */

const ArrayUtils = require('../array');

// eslint-disable-next-line no-unused-vars
// const FileUtil = require('../file');

const TableGenerator = require('../TableGenerator');

const initializeWeather = () => [
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

const initializeSmallWeather = () => [
  { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
  { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 }
];

global.describe('tableGenerator', () => {
  global.describe('prepare', () => {
    global.it('can prepare a table without any arguments', () => {
      const weather = initializeWeather();
      const expected = ({
        headers: ['id', 'city', 'month', 'precip'],
        data: [
          [1, 'Seattle',  'Aug', 0.87],
          [0, 'Seattle',  'Apr', 2.68],
          [2, 'Seattle',  'Dec', 5.31],
          [3, 'New York', 'Apr', 3.94],
          [4, 'New York', 'Aug', 4.13],
          [5, 'New York', 'Dec', 3.58],
          [6, 'Chicago',  'Apr', 3.62],
          [8, 'Chicago',  'Dec', 2.56],
          [7, 'Chicago',  'Aug', 3.98]
        ] });
      const results = new TableGenerator(weather)
        .prepare();
      global.expect(results.headers).toStrictEqual(expected.headers);
      global.expect(results.data).toStrictEqual(expected.data);
    });
    global.describe('sortFn', () => {
      global.it('can sort a table', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [0, 'Seattle',  'Apr', 2.68],
            [1, 'Seattle',  'Aug', 0.87],
            [2, 'Seattle',  'Dec', 5.31],
            [3, 'New York', 'Apr', 3.94],
            [4, 'New York', 'Aug', 4.13],
            [5, 'New York', 'Dec', 3.58],
            [6, 'Chicago',  'Apr', 3.62],
            [7, 'Chicago',  'Aug', 3.98],
            [8, 'Chicago',  'Dec', 2.56]
          ] });
        const results = new TableGenerator(weather)
          .sortFn(ArrayUtils.createSort('id'))
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('sort', () => {
      global.it('can sort by one column', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [0, 'Seattle',  'Apr', 2.68],
            [1, 'Seattle',  'Aug', 0.87],
            [2, 'Seattle',  'Dec', 5.31],
            [3, 'New York', 'Apr', 3.94],
            [4, 'New York', 'Aug', 4.13],
            [5, 'New York', 'Dec', 3.58],
            [6, 'Chicago',  'Apr', 3.62],
            [7, 'Chicago',  'Aug', 3.98],
            [8, 'Chicago',  'Dec', 2.56]
          ] });
        const results = new TableGenerator(weather)
          .sort('id')
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('can sort by two columns', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [6, 'Chicago',  'Apr', 3.62],
            [7, 'Chicago',  'Aug', 3.98],
            [8, 'Chicago',  'Dec', 2.56],
            [3, 'New York', 'Apr', 3.94],
            [4, 'New York', 'Aug', 4.13],
            [5, 'New York', 'Dec', 3.58],
            [0, 'Seattle',  'Apr', 2.68],
            [1, 'Seattle',  'Aug', 0.87],
            [2, 'Seattle',  'Dec', 5.31],
          ] });
        const results = new TableGenerator(weather)
          .sort('city', 'month')
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('columns', () => {
      global.it('can specify the columns to show', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city'],
          data: [
            [1, 'Seattle' ],
            [0, 'Seattle' ],
            [2, 'Seattle' ],
            [3, 'New York'],
            [4, 'New York'],
            [5, 'New York'],
            [6, 'Chicago' ],
            [8, 'Chicago' ],
            [7, 'Chicago' ]
          ] });
        const results = new TableGenerator(weather)
          .columns(['id', 'city'])
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('expects columns to be a list of strings or numbers', () => {
        const weather = initializeWeather();
        const instance = new TableGenerator(weather);
        global.expect(() => instance.columns({})).toThrow();
      });
    });
    global.describe('columnsToExclude', () => {
      global.it('can exclude columns by array', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'month', 'precip'],
          data: [
            [1, 'Aug', 0.87],
            [0, 'Apr', 2.68],
            [2, 'Dec', 5.31],
            [3, 'Apr', 3.94],
            [4, 'Aug', 4.13],
            [5, 'Dec', 3.58],
            [6, 'Apr', 3.62],
            [8, 'Dec', 2.56],
            [7, 'Aug', 3.98]
          ] });
        const results = new TableGenerator(weather)
          .columnsToExclude(['city'])
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('can exclude columns as arguments', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'month', 'precip'],
          data: [
            [1, 'Aug', 0.87],
            [0, 'Apr', 2.68],
            [2, 'Dec', 5.31],
            [3, 'Apr', 3.94],
            [4, 'Aug', 4.13],
            [5, 'Dec', 3.58],
            [6, 'Apr', 3.62],
            [8, 'Dec', 2.56],
            [7, 'Aug', 3.98]
          ] });
        const results = new TableGenerator(weather)
          .columnsToExclude('city')
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('throws an error if columns to exclude are invalid', () => {
        global.expect(() => new TableGenerator()
          .columnsToExclude(2)
          .prepare()).toThrow();
      });
    });
    global.describe('filter', () => {
      global.it('can filter results', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [1, 'Seattle',  'Aug', 0.87],
            [0, 'Seattle',  'Apr', 2.68],
            [2, 'Seattle',  'Dec', 5.31]
          ] });
        const results = new TableGenerator(weather)
          .filter((r) => r.city === 'Seattle')
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('labels', () => {
      global.it('can specify labels', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['Id', 'City of Birth', 'month', 'Precipitation'],
          data: [
            [1, 'Seattle',  'Aug', 0.87],
            [0, 'Seattle',  'Apr', 2.68],
            [2, 'Seattle',  'Dec', 5.31],
            [3, 'New York', 'Apr', 3.94],
            [4, 'New York', 'Aug', 4.13],
            [5, 'New York', 'Dec', 3.58],
            [6, 'Chicago',  'Apr', 3.62],
            [8, 'Chicago',  'Dec', 2.56],
            [7, 'Chicago',  'Aug', 3.98]
          ] });
        const results = new TableGenerator(weather)
          .labels({ id: 'Id', city: 'City of Birth', precip: 'Precipitation' })
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('formatterFn', () => {
      global.it('can provide a formatter', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [1, 'SEA', 'Aug', 0.87],
            [0, 'SEA', 'Apr', 2.68],
            [2, 'SEA', 'Dec', 5.31],
            [3, 'NY_', 'Apr', 3.94],
            [4, 'NY_', 'Aug', 4.13],
            [5, 'NY_', 'Dec', 3.58],
            [6, 'CHI', 'Apr', 3.62],
            [8, 'CHI', 'Dec', 2.56],
            [7, 'CHI', 'Aug', 3.98]
          ] });
        const cityMap = new Map([['Seattle', 'SEA'], ['Chicago', 'CHI'], ['New York', 'NY_']]);
        global.expect(cityMap.get('New York')).toBe('NY_');
        const cellFormatter = ({ value, property }) => property !== 'city'
          ? value
          : cityMap.get(value);
        const results = new TableGenerator(weather)
          .formatterFn(cellFormatter)
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('formatter', () => {
      global.it('can format with an object', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [1, 'SEA', 'aug', 0.87],
            [0, 'SEA', 'apr', 2.68],
            [2, 'SEA', 'dec', 5.31],
            [3, 'NY_', 'apr', 3.94],
            [4, 'NY_', 'aug', 4.13],
            [5, 'NY_', 'dec', 3.58],
            [6, 'CHI', 'apr', 3.62],
            [8, 'CHI', 'dec', 2.56],
            [7, 'CHI', 'aug', 3.98]
          ] });
        const cityMap = new Map([['Seattle', 'SEA'], ['Chicago', 'CHI'], ['New York', 'NY_']]);
        global.expect(cityMap.get('New York')).toBe('NY_');
        const formatObj = ({
          city: (value) => cityMap.has(value) ? cityMap.get(value) : value,
          month: (value) => value ? value.toLowerCase() : value
        });
        const results = new TableGenerator(weather)
          .formatter(formatObj)
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('clears the formatter if you send it again with null', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [1, 'Seattle',  'Aug', 0.87],
            [0, 'Seattle',  'Apr', 2.68],
            [2, 'Seattle',  'Dec', 5.31],
            [3, 'New York', 'Apr', 3.94],
            [4, 'New York', 'Aug', 4.13],
            [5, 'New York', 'Dec', 3.58],
            [6, 'Chicago',  'Apr', 3.62],
            [8, 'Chicago',  'Dec', 2.56],
            [7, 'Chicago',  'Aug', 3.98]
          ] });
        const results = new TableGenerator(weather)
          .formatter({})
          .formatter(null)
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
      global.it('throws an error if an invalid formatter is sent', () => {
        try {
          new TableGenerator(initializeSmallWeather())
            .formatter(() => {})
            .prepare();
          global.expect(true).toBe('an exception thrown');
        } catch (err) {
          // do nothing
        }
      });
      global.describe('basic type conversion', () => {
        global.it('string', () => {
          const weather = initializeWeather();
          const expected = ({
            headers: ['id', 'city', 'month', 'precip'],
            data: [
              [1, 'Seattle',  'Aug', '0.87'],
              [0, 'Seattle',  'Apr', '2.68'],
              [2, 'Seattle',  'Dec', '5.31'],
              [3, 'New York', 'Apr', '3.94'],
              [4, 'New York', 'Aug', '4.13'],
              [5, 'New York', 'Dec', '3.58'],
              [6, 'Chicago',  'Apr', '3.62'],
              [8, 'Chicago',  'Dec', '2.56'],
              [7, 'Chicago',  'Aug', '3.98']
            ] });
          const results = new TableGenerator(weather)
            .formatter({ precip: 'string' })
            .prepare();
          global.expect(results.headers).toStrictEqual(expected.headers);
          global.expect(results.data).toStrictEqual(expected.data);
        });
        global.it('string', () => {
          const weather = initializeWeather()
            .map((r) => ({ ...r, precip: String(r.precip) }));
          const expected = ({
            headers: ['id', 'city', 'month', 'precip'],
            data: [
              [1, 'Seattle',  'Aug', 0.87],
              [0, 'Seattle',  'Apr', 2.68],
              [2, 'Seattle',  'Dec', 5.31],
              [3, 'New York', 'Apr', 3.94],
              [4, 'New York', 'Aug', 4.13],
              [5, 'New York', 'Dec', 3.58],
              [6, 'Chicago',  'Apr', 3.62],
              [8, 'Chicago',  'Dec', 2.56],
              [7, 'Chicago',  'Aug', 3.98]
            ] });

          global.expect(weather[0].precip).toBe('0.87');
          const results = new TableGenerator(weather)
            .formatter({ precip: 'number' })
            .prepare();
          global.expect(results.headers).toStrictEqual(expected.headers);
          global.expect(results.data).toStrictEqual(expected.data);
        });
        global.it('string', () => {
          const weather = initializeWeather()
            .map((r) => ({ ...r, isHot: r.precip >= 4 }));
          const expected = ({
            headers: ['id', 'city', 'month', 'precip', 'isHot'],
            data: [
              [1, 'Seattle',  'Aug', 0.87, 'false'],
              [0, 'Seattle',  'Apr', 2.68, 'false'],
              [2, 'Seattle',  'Dec', 5.31, 'true'],
              [3, 'New York', 'Apr', 3.94, 'false'],
              [4, 'New York', 'Aug', 4.13, 'true'],
              [5, 'New York', 'Dec', 3.58, 'false'],
              [6, 'Chicago',  'Apr', 3.62, 'false'],
              [8, 'Chicago',  'Dec', 2.56, 'false'],
              [7, 'Chicago',  'Aug', 3.98, 'false']
            ] });

          const results = new TableGenerator(weather)
            .formatter({ isHot: 'boolean' })
            .prepare();
          global.expect(results.headers).toStrictEqual(expected.headers);
          global.expect(results.data).toStrictEqual(expected.data);
        });
        global.it('fails if formatter is string, but not string, number, boolean', () => {
          const weather = initializeWeather();
          
          const expectedError = 'TableGenerator.format: property precip formatter of somethingelse is unsupported. Only (String, Number, Boolean) are supported';
          global.expect(() => {
            new TableGenerator(weather)
              .formatter({
                precip: 'somethingElse'
              })
              .formatter(null)
              .prepare();
          }).toThrow(expectedError);
        });
      });
    });
    global.describe('limit', () => {
      global.it('can limit to 2 records', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [1, 'Seattle',  'Aug', 0.87],
            [0, 'Seattle',  'Apr', 2.68]
          ] });
        const results = new TableGenerator(weather)
          .limit(2)
          .prepare();
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can limit to last 2 records', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip'],
          data: [
            [7, 'Chicago',  'Aug', 3.98],
            [8, 'Chicago',  'Dec', 2.56]
          ] });
        const results = new TableGenerator(weather)
          .limit(-2)
          .prepare();
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('printOptions', () => {
      global.it('can influence dates through print options', () => {
        const data = [
          { id: 1, dateTime: new Date(2022, 3, 2, 9), child: { results: true } },
          { id: 2, dateTime: new Date(2022, 3, 3, 9), child: { results: false } },
          { id: 3, dateTime: new Date(2022, 3, 4, 9), child: { results: true } }
        ];
        const expected = `id|dateTime                |child          
--|--                      |--             
1 |2022-04-02T09:00:00.000Z|[object Object]
2 |2022-04-03T09:00:00.000Z|[object Object]
3 |2022-04-04T09:00:00.000Z|[object Object]`;
        const results = new TableGenerator(data)
          .printOptions({ collapseObjects: true, dateFormat: 'toISOString' })
          .generateMarkdown();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('augment', () => {
      global.it('can augment', () => {
        const weather = initializeWeather();
        const expected = ({
          headers: ['id', 'city', 'month', 'precip', 'state'],
          data: [
            [1, 'Seattle',  'Aug', 0.87, 'WA'],
            [0, 'Seattle',  'Apr', 2.68, 'WA'],
            [2, 'Seattle',  'Dec', 5.31, 'WA'],
            [3, 'New York', 'Apr', 3.94, 'NY'],
            [4, 'New York', 'Aug', 4.13, 'NY'],
            [5, 'New York', 'Dec', 3.58, 'NY'],
            [6, 'Chicago',  'Apr', 3.62, 'IL'],
            [8, 'Chicago',  'Dec', 2.56, 'IL'],
            [7, 'Chicago',  'Aug', 3.98, 'IL']
          ]
        });
        const cityState = new Map([['Seattle', 'WA'], ['New York', 'NY'], ['Chicago', 'IL']]);
        const results = new TableGenerator(weather)
          .augment({
            state: (row) => cityState.get(row.city)
          })
          .prepare();
        global.expect(results.headers).toStrictEqual(expected.headers);
        global.expect(results.data).toStrictEqual(expected.data);
      });
    });
    global.describe('transpose', () => {
      global.it('will transpose a result, if transposed once', () => {
        const data = [
          { name: 'John', color: 'green', age: 23, hair: 'blond', state: 'IL' },
          { name: 'Jane', color: 'brown', age: 23, hair: 'blonde', state: 'IL' }
        ];
        const expected = ({
          headers: ['name', 'John', 'Jane'],
          data: [
            ['color', 'green', 'brown'],
            ['age', 23, 23],
            ['hair', 'blond', 'blonde'],
            ['state', 'IL', 'IL']
          ]
        });

        const results = new TableGenerator(data)
          .transpose()
          .prepare();

        global.expect(results).toEqual(expected);
      });
      global.it('will be the same result, if transposed twice', () => {
        const data = [
          { name: 'John', color: 'green', age: 23, hair: 'blond', state: 'IL' },
          { name: 'Jane', color: 'brown', age: 23, hair: 'blonde', state: 'IL' }
        ];
        const expected = `name |John |Jane  
--   |--   |--    
color|green|brown 
age  |23   |23    
hair |blond|blonde
state|IL   |IL    `;

        const results = new TableGenerator(data)
          .transpose()
          .generateMarkdown();

        global.expect(results).toEqual(expected);
      });
    });
  });
  global.describe('generateHTML', () => {
    global.it('can render a table', () => {
      const weather = initializeSmallWeather();
      const results = new TableGenerator(weather)
        .columns(['id', 'city'])
        .generateHTML();
      global.expect(results).toBeTruthy();
    //-- @TODO: work on unit tests for the table
    });

    global.describe('styleTable', () => {
      global.it('can style the table', () => {
        const weather = initializeSmallWeather();
        const results = new TableGenerator(weather)
          .styleTable('1px solid black')
          .generateHTML();
        const expected = `<table cellspacing="0px" style="1px solid black">
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr >
\t<td >0</td>
\t<td >Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
    });

    global.describe('styleHeader', () => {
      global.it('can style the headers', () => {
        const weather = initializeSmallWeather();
        const results = new TableGenerator(weather)
          .styleHeader('1px solid black')
          .generateHTML();
        const expected = `<table cellspacing="0px" >
<tr style="1px solid black">
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr >
\t<td >0</td>
\t<td >Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
    });
    
    global.describe('styleRow', () => {
      global.it('can style the rows with a literal', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr style="style:1">
\t<td >0</td>
\t<td >Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        const styleRowFn = ({ rowIndex }) => rowIndex % 2 === 0 ? '' : `style:${rowIndex}`;
        const results = new TableGenerator(weather)
          .styleRow(styleRowFn)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('styleCell', () => {
      global.it('can style the cells with a literal', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr >
\t<td >0</td>
\t<td style="style:1 ">Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        const styleRowFn = ({ rowIndex, columnIndex }) => (rowIndex % 2 === 1 && columnIndex === 1) ? `style:${rowIndex}` : '';
        const results = new TableGenerator(weather)
          .styleCell(styleRowFn)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('border', () => {
      global.it('adds a border AND styleRow', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td style=" border: 1px solid #AAA">1</td>
\t<td style=" border: 1px solid #AAA">Seattle</td>
\t<td style=" border: 1px solid #AAA">Aug</td>
\t<td style=" border: 1px solid #AAA">0.87</td>
</tr>
<tr >
\t<td style=" border: 1px solid #AAA">0</td>
\t<td style="style:1 border: 1px solid #AAA">Seattle</td>
\t<td style=" border: 1px solid #AAA">Apr</td>
\t<td style=" border: 1px solid #AAA">2.68</td>
</tr>
</table>`;
        const styleRowFn = ({ rowIndex, columnIndex }) => (rowIndex % 2 === 1 && columnIndex === 1) ? `style:${rowIndex}` : '';
        const borderCSS = true;
        const results = new TableGenerator(weather)
          .styleCell(styleRowFn)
          .border(borderCSS)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
      global.it('adds a border with true', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td style=" border: 1px solid #AAA">1</td>
\t<td style=" border: 1px solid #AAA">Seattle</td>
\t<td style=" border: 1px solid #AAA">Aug</td>
\t<td style=" border: 1px solid #AAA">0.87</td>
</tr>
<tr >
\t<td style=" border: 1px solid #AAA">0</td>
\t<td style=" border: 1px solid #AAA">Seattle</td>
\t<td style=" border: 1px solid #AAA">Apr</td>
\t<td style=" border: 1px solid #AAA">2.68</td>
</tr>
</table>`;
        const borderCSS = true;
        const results = new TableGenerator(weather)
          .border(borderCSS)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
      global.it('adds a border with explicit css', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td style=" border: 2px dotted blue">1</td>
\t<td style=" border: 2px dotted blue">Seattle</td>
\t<td style=" border: 2px dotted blue">Aug</td>
\t<td style=" border: 2px dotted blue">0.87</td>
</tr>
<tr >
\t<td style=" border: 2px dotted blue">0</td>
\t<td style=" border: 2px dotted blue">Seattle</td>
\t<td style=" border: 2px dotted blue">Apr</td>
\t<td style=" border: 2px dotted blue">2.68</td>
</tr>
</table>`;
        const borderCSS = '2px dotted blue';
        const results = new TableGenerator(weather)
          .border(borderCSS)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
    });
    
    global.describe('augment', () => {
      global.it('can augment additional columns', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>precip</th>
\t<th>month</th>
\t<th>fullMonth</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >0.87</td>
\t<td >Aug</td>
\t<td >August</td>
</tr>
<tr >
\t<td >0</td>
\t<td >Seattle</td>
\t<td >2.68</td>
\t<td >Apr</td>
\t<td >April</td>
</tr>
</table>`;
        const monthMap = new Map([['Apr', 'April'], ['Dec', 'December'], ['Aug', 'August']]);
        const results = new TableGenerator(weather)
          .augment(({ fullMonth: (row) => monthMap.get(row.month) }))
          .columns(['id', 'city', 'precip', 'month', 'fullMonth'])
          .generateHTML();
        //FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });
      global.it('clears the format if we send a null formatter', () => {
        const weather = initializeSmallWeather();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr >
\t<td >0</td>
\t<td >Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        const results = new TableGenerator(weather)
          .augment(null)
          .generateHTML();
        // FileUtil.writeFileStd('./tmp/tmp', results);
        global.expect(results).toBe(expected);
      });

      global.it('throws an error if a function was sent to the augment', () => {
        const weather = initializeSmallWeather();
        global.expect(() => new TableGenerator(weather)
          .augment(() => {})
          .generateHTML()).toThrow();
      });
    });
  });
  global.describe('generateMarkdown', () => {
    global.it('can render csv', () => {
      const weather = initializeWeather().slice(0, 2);
      const expected = 'id|city   \n--|--     \n1 |Seattle\n0 |Seattle';
      const results = new TableGenerator(weather)
        .columns('id', 'city')
        .generateMarkdown({ align: true });
      global.expect(results).toBeTruthy();
      global.expect(results).toBe(expected);
    });
    global.it('can render as default', () => {
      const weather = initializeWeather().slice(0, 2);
      const expected = 'id|city   |month\n--|--     |--   \n1 |Seattle|Aug  \n0 |Seattle|Apr  ';
      const results = new TableGenerator(weather)
        .columns('id', 'city', 'month')
        .generateMarkdown();
      global.expect(results).toBeTruthy();
      global.expect(results).toBe(expected);
    });
    global.it('can render csv not unified', () => {
      const weather = initializeWeather().slice(0, 2);
      const expected = 'id|city|month\n--|--|--\n1|Seattle|Aug\n0|Seattle|Apr';
      const results = new TableGenerator(weather)
        .columns('id', 'city', 'month')
        .generateMarkdown({ align: false });
      global.expect(results).toBeTruthy();
      global.expect(results).toBe(expected);
    });
  });
  global.describe('generateCSV', () => {
    global.it('can render csv', () => {
      const weather = initializeWeather().slice(0, 2);
      const expected = '"id","city","month"\n"1","Seattle","Aug"\n"0","Seattle","Apr"';
      const results = new TableGenerator(weather)
        .columns('id', 'city', 'month')
        .generateCSV();
      // console.log(JSON.stringify(results));
      // console.log(results);
      global.expect(results).toBeTruthy();
      global.expect(results).toBe(expected);
    });
  });
  global.describe('generateArray', () => {
    global.it('can prepare a table without any arguments', () => {
      const weather = initializeWeather();
      const expected = ({
        headers: ['id', 'city', 'month', 'precip'],
        data: [
          [1, 'Seattle',  'Aug', 0.87],
          [0, 'Seattle',  'Apr', 2.68],
          [2, 'Seattle',  'Dec', 5.31],
          [3, 'New York', 'Apr', 3.94],
          [4, 'New York', 'Aug', 4.13],
          [5, 'New York', 'Dec', 3.58],
          [6, 'Chicago',  'Apr', 3.62],
          [8, 'Chicago',  'Dec', 2.56],
          [7, 'Chicago',  'Aug', 3.98]
        ] });
      const results = new TableGenerator(weather)
        .generateArray();
      global.expect(results.headers).toStrictEqual(expected.headers);
      global.expect(results.data).toStrictEqual(expected.data);
    });
  });
  global.describe('generateArray2', () => {
    global.it('can prepare a table without any arguments', () => {
      const weather = initializeWeather();
      const expected = [
        ['id', 'city', 'month', 'precip'],
        [1, 'Seattle',  'Aug', 0.87],
        [0, 'Seattle',  'Apr', 2.68],
        [2, 'Seattle',  'Dec', 5.31],
        [3, 'New York', 'Apr', 3.94],
        [4, 'New York', 'Aug', 4.13],
        [5, 'New York', 'Dec', 3.58],
        [6, 'Chicago',  'Apr', 3.62],
        [8, 'Chicago',  'Dec', 2.56],
        [7, 'Chicago',  'Aug', 3.98]
      ];
      const results = new TableGenerator(weather)
        .generateArray2();
      global.expect(results.headers).toStrictEqual(expected.headers);
      global.expect(results.data).toStrictEqual(expected.data);
    });
  });

  global.describe('ijs aware', () => {
    const OLD_CONSOLE = global.console;
    beforeEach(() => {
      const createNewDisplay = (name) => {
        const valueFn = (value) => `display:${name}:${(value)}`;
        const newDisplay = ({
          async: () => {},
          text: valueFn,
          png: valueFn,
          svg: valueFn,
          html: valueFn,
          jpg: valueFn,
          mime: valueFn,
          sendResults: valueFn
        });
        return newDisplay;
      };
      
      const prepareIJSContext = () => {
        const newContext = ({
          ...createNewDisplay(),
          createDisplay: createNewDisplay,
          sendResult: () => {}
        });
        global.$$ = newContext;
        global.console = ({
          error: jest.fn(),
          log: jest.fn(),
          warn: jest.fn()
        });
      };

      prepareIJSContext();
    });
    afterEach(() => {
      delete global.$$;
    });
    afterAll(() => {
      global.console = OLD_CONSOLE;
    });
    global.describe('render', () => {
      global.it('has ijs context by default', () => {
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
      });
      global.it('throws an error if not in IJS', () => {
        delete global.$$;
        const data = initializeSmallWeather();
        const instance = new TableGenerator(data);
        
        global.expect(() => instance.render()).toThrow();
      });
      global.it('can render a result without error', () => {
        const htmlSpy = jest.spyOn(global.$$, 'html');
        const data = initializeSmallWeather();
        new TableGenerator(data)
          .render();
        
        global.expect(htmlSpy).toHaveBeenCalled();
        const expected = `<table cellspacing="0px" >
<tr >
\t<th>id</th>
\t<th>city</th>
\t<th>month</th>
\t<th>precip</th>
</tr>
<tr >
\t<td >1</td>
\t<td >Seattle</td>
\t<td >Aug</td>
\t<td >0.87</td>
</tr>
<tr >
\t<td >0</td>
\t<td >Seattle</td>
\t<td >Apr</td>
\t<td >2.68</td>
</tr>
</table>`;
        const results = htmlSpy.mock.calls[0][0];
        // FileUtil.writeFileStd('./tmp/tmp', results);

        global.expect(results).toBe(expected);
      });
    });

    global.describe('renderMarkdown', () => {
      global.it('has ijs context by default', () => {
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
      });
      global.it('throws an error if not in IJS', () => {
        delete global.$$;
        const data = initializeSmallWeather();
        const instance = new TableGenerator(data);
        
        global.expect(() => instance.renderMarkdown()).toThrow();
      });
      global.it('can render a result without error', () => {
        const consoleSpy = jest.spyOn(global.console, 'log');
        const data = initializeSmallWeather();
        new TableGenerator(data)
          .renderMarkdown();
        
        global.expect(consoleSpy).toHaveBeenCalled();
        const expected = ''
+ `id|city   |month|precip
--|--     |--   |--    
1 |Seattle|Aug  |0.87  
0 |Seattle|Apr  |2.68  `;
        const results = consoleSpy.mock.calls[0][0];
        //FileUtil.writeFileStd('./tmp/tmp', results);

        global.expect(results).toBe(expected);
      });
    });

    global.describe('renderCSV', () => {
      global.it('has ijs context by default', () => {
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
      });
      global.it('throws an error if not in IJS', () => {
        delete global.$$;
        const data = initializeSmallWeather();
        const instance = new TableGenerator(data);
        
        global.expect(() => instance.renderCSV()).toThrow();
      });
      global.it('can render a result without error', () => {
        const consoleSpy = jest.spyOn(global.console, 'log');
        const data = initializeSmallWeather();
        new TableGenerator(data)
          .renderCSV();
        
        global.expect(consoleSpy).toHaveBeenCalled();
        const expected = ''
+ `"id","city","month","precip"
"1","Seattle","Aug","0.87"
"0","Seattle","Apr","2.68"`;
        const results = consoleSpy.mock.calls[0][0];
        // FileUtil.writeFileStd('./tmp/tmp', results);

        global.expect(results).toBe(expected);
      });
    });
  });
});
