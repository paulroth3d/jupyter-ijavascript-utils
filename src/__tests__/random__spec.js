const RandomUtil = require('../random');

const randomSeed = 1;
const randomValue = 0.5;

global.describe('random', () => {
  beforeEach(() => {
    RandomUtil.seed(randomSeed);
    jest.spyOn(global.Math, 'random').mockReturnValue(randomValue);
  });
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  global.describe('seed', () => {
    global.it('can set the seed', () => {
      const expectedSeed = 12345;
      RandomUtil.seed(expectedSeed);
      const resultSeed = RandomUtil.getSeed();
      global.expect(resultSeed).toBe(expectedSeed);
    });
    global.it('can clear the seed', () => {
      const expectedSeed = undefined;
      RandomUtil.seed(12345);
      RandomUtil.seed(expectedSeed);
      const result = RandomUtil.getSeed();
      global.expect(result).toBe(expectedSeed);
    });
  });
  global.describe('randomInteger', () => {
    global.it('can get a random integer with defaults', () => {
      const min = 0;
      const max = 100;
      const expected = (max - min) * randomValue;
      const result = RandomUtil.randomInteger();

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
    global.it('can get a random integer between 0 and 10', () => {
      const min = 0;
      const max = 10;
      const expected = 5;
      const result = RandomUtil.randomInteger(min, max);

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
    global.it('can get a random integer between 10 and 12', () => {
      const min = 10;
      const max = 12;
      const expected = 11;
      const result = RandomUtil.randomInteger(min, max);

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
  });
  global.describe('random', () => {
    global.it('can get a random number with defaults', () => {
      const min = 0;
      const max = 1;
      const expected = (max - min) * randomValue;
      const result = RandomUtil.random();

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
    global.it('can get a random number between 0 and 10', () => {
      const min = 0;
      const max = 10;
      const expected = 5;
      const result = RandomUtil.random(min, max);

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
    global.it('can get a random number between 10 and 12', () => {
      const min = 10;
      const max = 12;
      const expected = 11;
      const result = RandomUtil.random(min, max);

      global.expect(Math.random).toHaveBeenCalledTimes(1);
      const call = Math.random.mock.calls[0][0];
      global.expect(call).toBe(randomSeed);

      global.expect(result).toBe(expected);
    });
  });
  global.describe('pickRandom', () => {
    global.it('pickRandom', () => {
      const targetArray = [0, 1, 2, 3, 4, 5, 6];
      const expected = 3;
      const result = RandomUtil.pickRandom(targetArray);
      global.expect(result).toBe(expected);
    });
    global.it('Fails if the target array is not an array', () => {
      const targetArray = 2;
      const expectedError = 'utils.random.pickRandom(targetArray): targetArray must be an array';
      global.expect(() => RandomUtil.pickRandom(targetArray))
        .toThrow(expectedError);
    });
    global.it('Fails if the target array is null', () => {
      const targetArray = 2;
      const expectedError = 'utils.random.pickRandom(targetArray): targetArray must be an array';
      global.expect(() => RandomUtil.pickRandom(targetArray))
        .toThrow(expectedError);
    });
    global.it('returns null if picking an empty array', () => {
      const targetArray = [];
      const expected = null;
      const result = RandomUtil.pickRandom(targetArray);
      global.expect(result).toBe(expected);
    });
    global.it('returns first item if array has only one thing in it', () => {
      const expectedValue = 99;
      const targetArray = [expectedValue];
      const expected = expectedValue;
      const result = RandomUtil.pickRandom(targetArray);
      global.expect(result).toBe(expected);
    });
  });
  global.describe('randomArray', () => {
    global.it('picks random values', () => {
      const arraySize = 8;
      const randomFn = () => 1;
      const expected = [1, 1, 1, 1, 1, 1, 1, 1];
      const results = RandomUtil.randomArray(arraySize, randomFn);
      global.expect(results).toEqual(expected);
    });
    global.it('picks random with defaults', () => {
      const arraySize = 8;
      const randomFn = undefined;
      const expected = [randomValue, randomValue, randomValue, randomValue,
        randomValue, randomValue, randomValue, randomValue
      ];
      const results = RandomUtil.randomArray(arraySize, randomFn);
      global.expect(results).toEqual(expected);
    });
    global.it('throws an error if the array size is negative', () => {
      const arraySize = -1;
      const expectedError = 'random.randomArray(size, fn): array size cannot be less than 1';
      global.expect(
        () => RandomUtil.randomArray(arraySize)
      ).toThrow(expectedError);
    });
  });
  global.describe('String arrays', () => {
    global.it('pick one', () => {
      const targetArray = ['a', 'b', 'c', 'd', 'e'];
      const expected = 'c';
      const result = RandomUtil.pickRandom(targetArray);
      global.expect(result).toBe(expected);
    });
  });
});

global.describe('simplexNoise', () => {
  //-- tests will be very hard to capture
  global.it('can set the seed', () => {
    const generator = RandomUtil.simplexGenerator(randomSeed);

    global.expect(() => generator.seed(randomSeed)).not.toThrow();
  });

  global.it('can get simplex2d noise', () => {
    const generator = RandomUtil.simplexGenerator(randomSeed);

    const x = 0.1;
    const y = 0.1;
    const result = generator.simplex2d(x, y);

    global.expect(result).toBeGreaterThanOrEqual(-1);
    global.expect(result).toBeLessThanOrEqual(1);
  });
  global.it('can get simplex3d noise', () => {
    const generator = RandomUtil.simplexGenerator(randomSeed);

    const x = 0.1;
    const y = 0.1;
    const z = 0.1;
    const result = generator.simplex3d(x, y, z);

    global.expect(result).toBeGreaterThanOrEqual(-1);
    global.expect(result).toBeLessThanOrEqual(1);
  });
});
