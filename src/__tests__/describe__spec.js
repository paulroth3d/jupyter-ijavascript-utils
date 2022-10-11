const DescribeUtil = require('../describe');

global.describe('DescribeUtil', () => {
  global.describe('StringDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is not full of numbers', () => {
        const collection = [0];
        
        global.expect(() => {
          DescribeUtil.describeStrings(collection);
        }).toThrow('describe: Value passed(0) expected to be:string, but was: number');
      });
    });
    global.describe('can describe', () => {
      global.it('a string of one', () => {
        const collection = ['a'];
        const expected = {
          count: 1,
          max: 'a',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a string of multiple different strings', () => {
        const collection = ['a', 'apple', 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with undefined in the list', () => {
        const collection = ['a', 'apple', undefined, 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with an empty string in the list', () => {
        const collection = ['a', 'apple', '', 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a string of multiple different strings', () => {
        const collection = ['a', 'apple', 'binding', 'a'];
        const expected = {
          count: 4,
          max: 'binding',
          min: 'a',
          top: 'a',
          topFrequency: 2
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is null', () => {
        const collection = null;
        const expected = {
          count: 0,
          max: null,
          min: null,
          top: null,
          topFrequency: null
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        const expected = {
          count: 0,
          max: null,
          min: null,
          top: null,
          topFrequency: null
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
    });
  });

  global.describe('NumberDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is not full of numbers', () => {
        const collection = ['a'];
        
        global.expect(() => {
          DescribeUtil.describeNumbers(collection);
        }).toThrow('describe: Value passed(a) expected to be:number, but was: string');
      });
    });
    global.describe('can describe', () => {
      global.it('if the collection is null', () => {
        const collection = null;
        const expected = {
          count: 0,
          max: null,
          min: null,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        const expected = {
          count: 0,
          max: null,
          min: null,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a number of one', () => {
        const collection = [1];
        const expected = {
          count: 1,
          max: 1,
          min: 1,
          mean: 1,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      
      global.it('a pair of numbers: 1,3', () => {
        const collection = [1, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a pair of numbers: 3,1', () => {
        const collection = [3, 1];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with null', () => {
        const collection = [1, null, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with undefined', () => {
        const collection = [1, undefined, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });

      global.it('multiple numbers:1, 3, 5, 7', () => {
        const collection = [1, 3, 5, 7];
        const expected = {
          count: 4,
          max: 7,
          min: 1,
          mean: 4
        };
        const stdDeviation = 2.23606797749979;
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
        global.expect(results.stdDeviation).toBeCloseTo(stdDeviation);
      });
      global.it('multiple numbers: 3,5,7,9,11', () => {
        const collection = [3, 5, 7, 9, 11];
        const expected = {
          count: 5,
          max: 11,
          min: 3,
          mean: 7
        };
        const stdDeviation = 2.828427;
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
        global.expect(results.stdDeviation).toBeCloseTo(stdDeviation);
      });
    });
  });

  global.describe('BooleanDescription', () => {
    global.describe('can describe', () => {
      global.it('a single boolean value: true', () => {
        const collection = true;
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 1,
          max: 1,
          min: null,
          mean: 1
        };
        global.expect(results).toMatchObject(expected);
      });
      global.it('a single boolean value: [false]', () => {
        const collection = [false];
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 1,
          max: null,
          min: 0,
          mean: 0
        };
        global.expect(results).toMatchObject(expected);
      });
      global.it('two boolean values', () => {
        const collection = ['true', false];
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 2,
          max: 1,
          min: 0,
          mean: 0.5
        };
        global.expect(results).toMatchObject(expected);
      });
      global.it('multiple boolean values: true true', () => {
        const collection = ['TRUE', 'True'];
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 2,
          max: 1,
          min: null,
          mean: 1
        };
        global.expect(results).toMatchObject(expected);
      });
      global.it('with null', () => {
        const collection = ['TRUE', null, undefined, 'True'];
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 2,
          max: 1,
          min: null,
          mean: 1
        };
        global.expect(results).toMatchObject(expected);
      });
      global.it('multiple mixed values', () => {
        const collection = ['TRUE', 'false', 'true', 'No', 'True'];
        const results = DescribeUtil.describeBoolean(collection);
        const expected = {
          count: 5,
          max: 1,
          min: 0,
          mean: 0.6
        };
        global.expect(results).toMatchObject(expected);
      });
    });
  });

  global.describe('DateDescription', () => {
    global.describe('can describe', () => {
      global.it('can work with a single integer', () => {
        const collection = 1664743997857;
        const result = DescribeUtil.describeDates(collection);
        const expected = {
          count: 1,
          max: new Date(1664743997857),
          min: new Date(1664743997857),
          mean: new Date(1664743997857)
        };
        global.expect(result).toMatchObject(expected);
      });
      global.it('can work with a single date', () => {
        const collection = new Date(1664743997857);
        const result = DescribeUtil.describeDates(collection);
        const expected = {
          count: 1,
          max: new Date(1664743997857),
          min: new Date(1664743997857),
          mean: new Date(1664743997857)
        };
        global.expect(result).toMatchObject(expected);
      });
      global.it('can work with mixed dates', () => {
        const collection = [new Date(1664743997857), 1664744188041];
        const result = DescribeUtil.describeDates(collection);
        const expected = {
          count: 2,
          max: new Date(1664744188041),
          min: new Date(1664743997857),
          mean: new Date(1664744092949)
        };
        global.expect(result).toMatchObject(expected);
      });
      global.it('can work with null', () => {
        const collection = [null];
        const result = DescribeUtil.describeDates(collection);
        const expected = {
          count: 0,
          max: null,
          min: null,
          mean: null
        };
        global.expect(result).toMatchObject(expected);
      });
      global.it('can work with values + null', () => {
        const collection = 1664743997857;
        const result = DescribeUtil.describeDates(collection);
        const expected = {
          count: 1,
          max: new Date(1664743997857),
          min: new Date(1664743997857),
          mean: new Date(1664743997857)
        };
        global.expect(result).toMatchObject(expected);
      });
    });
    global.describe('fails', () => {
      global.it('if the value is not a date', () => {
        const collection = ['a'];
        global.expect(() => DescribeUtil.describeDates(collection))
          .toThrow('describe: Value passed(a) - expected to be type:Date');
      });
      global.it('if one of the values in the list is not a date', () => {
        const collection = [new Date(), 23, 'a'];
        global.expect(() => DescribeUtil.describeDates(collection))
          .toThrow('describe: Value passed(a) - expected to be type:Date');
      });
    });
  });

  global.describe('stdDeviation', () => {
    global.it('for one number', () => {
      const series = [1];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 0;
      global.expect(result).toBe(expected);
    });
    global.it('for one number', () => {
      const series = [1];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 0;
      global.expect(result).toBe(expected);
    });
    global.it('for two numbers', () => {
      const series = [1, 3];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 1;
      global.expect(result).toBe(expected);
    });
    global.it('for four numbers: 1, 3, 5, 7', () => {
      const series = [1, 3, 5, 7];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 2.23606797749979;
      global.expect(result).toBeCloseTo(expected);
    });
    global.it('for five numbers: 3, 5, 7, 9, 11', () => {
      const series = [3, 5, 7, 9, 11];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 2.8284271247461903;
      global.expect(result).toBeCloseTo(expected);
    });
  });

  global.describe('describeObjects', () => {
    global.describe('can describe', () => {
      global.it('a single simple object', () => {
        const collection = {
          first: 'john',
          last: 'doe',
          age: 23
        };
        const expected = [{
          count: 1,
          max: 'john',
          min: 'john',
          top: 'john',
          topFrequency: 1,
          type: 'string',
          unique: 1,
          what: 'first'
        },
        {
          count: 1,
          max: 'doe',
          min: 'doe',
          top: 'doe',
          topFrequency: 1,
          type: 'string',
          unique: 1,
          what: 'last'
        },
        {
          count: 1,
          max: 23,
          mean: 23,
          min: 23,
          stdDeviation: 0,
          type: 'number',
          what: 'age'
        }];
        
        const result = DescribeUtil.describeObjects(collection);
        global.expect(result).toMatchObject(expected);
      });
      global.it('a single complex object', () => {
        const collection = {
          name: 'john',
          age: 23,
          isStudent: true,
          date: new Date('2022-08-09T09:00:00.000Z')
        };
        const expected = [
          {
            count: 1,
            max: 'john',
            min: 'john',
            top: 'john',
            topFrequency: 1,
            type: 'string',
            unique: 1,
            what: 'name',
          },
          {
            count: 1,
            max: 23,
            mean: 23,
            min: 23,
            stdDeviation: 0,
            type: 'number',
            what: 'age',
          },
          {
            count: 1,
            max: 1,
            mean: 1,
            min: null,
            type: 'boolean',
            what: 'isStudent',
          },
          {
            count: 1,
            max: new Date('2022-08-09T09:00:00.000Z'),
            mean: new Date('2022-08-09T09:00:00.000Z'),
            min: new Date('2022-08-09T09:00:00.000Z'),
            type: 'Date',
            what: 'date',
          },
        ];
        
        const result = DescribeUtil.describeObjects(collection);
        global.expect(result).toMatchObject(expected);
      });
      global.it('a collection', () => {
        const collection = [{
          first: 'john',
          last: 'doe',
          age: 23,
          enrolled: new Date('2022-01-01')
        }, {
          first: 'john',
          last: 'doe',
          age: 24,
          enrolled: new Date('2022-01-03')
        }, {
          first: 'jan',
          last: 'doe',
          age: 25,
          enrolled: new Date('2022-01-05')
        }];
        const expected = [{
          count: 3,
          max: 'john',
          min: 'jan',
          top: 'john',
          topFrequency: 2,
          type: 'string',
          unique: 2,
          what: 'first'
        },
        {
          count: 3,
          max: 'doe',
          min: 'doe',
          top: 'doe',
          topFrequency: 3,
          type: 'string',
          unique: 1,
          what: 'last'
        }, {
          count: 3,
          max: 25,
          min: 23,
          mean: 24,
          stdDeviation: 0.816496580927726,
          type: 'number',
          what: 'age'
        }, {
          count: 3,
          max: new Date('2022-01-05'),
          min: new Date('2022-01-01'),
          mean: new Date('2022-01-03'),
          type: 'Date',
          what: 'enrolled'
        }];
        
        const result = DescribeUtil.describeObjects(collection);
        global.expect(result).toMatchObject(expected);
        // console.log(JSON.stringify(expected));
      });
      global.it('a collection with objects', () => {
        const collection = [{
          age: 23,
          height: 6.0,
          student: { id: 22 }
        }, {
          age: 24,
          height: 6.1,
          student: { id: 22 }
        }, {
          age: 25,
          height: 6.2,
          student: { id: 22 }
        }];
        const expected = [
          {
            count: 3,
            max: 25,
            mean: 24,
            min: 23,
            stdDeviation: 0.816496580927726,
            type: 'number',
            what: 'age'
          },
          {
            count: 3,
            max: 6.2,
            mean: 6.1,
            min: 6,
            stdDeviation: 0.08164965809277276,
            type: 'number',
            what: 'height'
          }, {
            count: 3,
            type: 'object',
            what: 'student'
          }
        ];
        const result = DescribeUtil.describeObjects(collection);
        global.expect(result).toMatchObject(expected);
      });
      global.it('a collection with only numbers', () => {
        const collection = [{
          age: 23,
          height: 6.0
        }, {
          age: 24,
          height: 6.1,
        }, {
          age: 25,
          height: 6.2,
        }];
        const expected = [
          {
            count: 3,
            max: 25,
            mean: 24,
            min: 23,
            stdDeviation: 0.816496580927726,
            type: 'number',
            what: 'age'
          },
          {
            count: 3,
            max: 6.2,
            mean: 6.1,
            min: 6,
            stdDeviation: 0.08164965809277276,
            type: 'number',
            what: 'height'
          }
        ];
        const result = DescribeUtil.describeObjects(collection);
        global.expect(result).toMatchObject(expected);
      });
      global.it('only specific fields', () => {
        const collection = [{
          first: 'john',
          last: 'doe',
          age: 23
        }, {
          first: 'jan',
          last: 'doe',
          age: 25
        }];
        const expected = [{
          count: 2,
          max: 'john',
          min: 'jan',
          topFrequency: 1,
          type: 'string',
          unique: 2,
          what: 'first'
        },
        {
          count: 2,
          max: 'doe',
          min: 'doe',
          top: 'doe',
          topFrequency: 2,
          type: 'string',
          unique: 1,
          what: 'last'
        }];
        
        const result = DescribeUtil.describeObjects(collection, { include: ['first', 'last'] });
        global.expect(result).toMatchObject(expected);
      });
      global.it('excluding a specific field', () => {
        const collection = {
          first: 'john',
          last: 'doe',
          age: 23
        };
        const expected = [{
          count: 1,
          max: 'doe',
          min: 'doe',
          top: 'doe',
          topFrequency: 1,
          type: 'string',
          unique: 1,
          what: 'last'
        },
        {
          count: 1,
          max: 23,
          mean: 23,
          min: 23,
          stdDeviation: 0,
          type: 'number',
          what: 'age'
        }];
        
        const result = DescribeUtil.describeObjects(collection, { exclude: ['first'] });
        global.expect(result).toMatchObject(expected);
      });
      global.it('including fields, but excluding a field', () => {
        const collection = {
          first: 'john',
          last: 'doe',
          age: 23
        };
        const expected = [{
          count: 1,
          max: 'doe',
          min: 'doe',
          top: 'doe',
          topFrequency: 1,
          type: 'string',
          unique: 1,
          what: 'last'
        }];
        
        const result = DescribeUtil.describeObjects(collection, { exclude: ['first'], include: ['first', 'last'] });
        global.expect(result).toMatchObject(expected);
      });
      /*
      global.it('prepareFn', () => {
        const collection = [{
          date: '04-13-01'
        }, {
          date: '04-14-01'
        }];

        const translator = (val) => {
          const dateMatch = val.date
            ? val.date.match(/(\d\d)-(\d\d)-(\d\d)/)
            : null;
          if (dateMatch) {
            const newDate = `${dateMatch[1]}-${dateMatch[0]}-20${dateMatch[2]}}`;
            console.log(`${newDate}`);
            val.date = new Date(newDate);
          } else {
            val.date = null;
          }
          return val;
        };

        const expected = [];
        const result = DescribeUtil.describeObjects(collection, { prepareFn: translator });
        global.expect(result).toBe(expected);
      });
      */
      global.it('with null properties', () => {
        const collection = [{
          first: 'john'
        }, {
          first: 'john',
        }, {
          first: 'doe',
        }, {
          first: null
        }];
        //-- only four values found
        const expected = [{
          count: 3,
          max: 'john',
          min: 'doe',
          top: 'john',
          topFrequency: 2,
          type: 'string',
          unique: 2,
          what: 'first',
        }];
        const results = DescribeUtil.describeObjects(collection);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('override type as', () => {
        const collection = [{
          name: 'john',
          age: 22,
          isBoolean: 'true',
          isAnotherBoolean: 'true',
          date: new Date('2022-01-01'),
          student: { id: 99 }
        }];
        const override = {
          name: 'string',
          age: 'number',
          isBoolean: 'boolean',
          isAnotherBoolean: 'bool',
          date: 'date',
          ignore: 'unknown'
        };
        const expected = [
          {
            count: 1,
            max: 'john',
            min: 'john',
            top: 'john',
            topFrequency: 1,
            type: 'string',
            unique: 1,
            what: 'name',
          },
          {
            count: 1,
            max: 22,
            mean: 22,
            min: 22,
            stdDeviation: 0,
            type: 'number',
            what: 'age',
          },
          {
            count: 1,
            max: 'true',
            min: 'true',
            top: 'true',
            topFrequency: 1,
            type: 'string',
            unique: 1,
            what: 'isBoolean',
          },
          {
            count: 1,
            max: 'true',
            min: 'true',
            top: 'true',
            topFrequency: 1,
            type: 'string',
            unique: 1,
            what: 'isAnotherBoolean',
          },
          {
            count: 1,
            max: new Date('2022-01-01T00:00:00.000Z'),
            mean: new Date('2022-01-01T00:00:00.000Z'),
            min: new Date('2022-01-01T00:00:00.000Z'),
            type: 'Date',
            what: 'date',
          },
          {
            count: 1,
            max: null,
            min: null,
            type: 'object',
            what: 'student',
          }
        ];
        const results = DescribeUtil.describeObjects(collection, { overridePropertyType: override });
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('maxRows', () => {
      global.it('describeObjects', () => {
        const collection = [{
          num: 1
        }, {
          num: 2
        }, {
          num: 3
        }];
        const expected = [{
          count: 2,
          max: 2,
          min: 1,
          mean: 1.5,
          stdDeviation: 0.5,
          type: 'number',
          what: 'num'
        }];
        const results = DescribeUtil.describeObjects(collection, { maxRows: 2 });
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
});
