const SetUtils = require('../set');

global.describe('SetUtils', () => {
  global.it('can add a value to set', () => {
    const source = new Set([1, 2, 3]);
    const results = SetUtils.add(source, 4, 5);
    const expected = new Set([1, 2, 3, 4, 5]);
    global.expect(results).toEqual(expected);
  });
  global.describe('setUnion', () => {
    global.it('can add a union of sets', () => {
      const source = new Set([1, 2, 3]);
      const results = SetUtils.union(source, new Set([4, 5]));
      const expected = new Set([1, 2, 3, 4, 5]);
      global.expect(results).toEqual(expected);
    });
    global.it('can add a union of array', () => {
      const source = new Set([1, 2, 3]);
      const results = SetUtils.union(source, [4, 5]);
      const expected = new Set([1, 2, 3, 4, 5]);
      global.expect(results).toEqual(expected);
    });
    global.it('can add an array to an array', () => {
      const source = [1, 2, 3];
      const results = SetUtils.union(source, [4, 5]);
      const expected = new Set([1, 2, 3, 4, 5]);
      global.expect(results).toEqual(expected);
    });
    global.it('throws an error if a non-iterable is asked to union', () => {
      const source = new Set([1, 2, 3]);

      try {
        SetUtils.union(source, { john: 'doe' });
        jest.fail('SetUtils: should throw an error if the items to remove is not iterable');
      } catch (err) {
        //
      }
    });
    global.it('adds nothing if the target is null', () => {
      const source = new Set([1, 2, 3]);
      const target = null;
      const expected = new Set(source);
      const results = SetUtils.union(source, target);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('intersection', () => {
    global.it('can find intersection of two sets', () => {
      const sourceA = new Set([1, 2, 3]);
      const sourceB = new Set([3, 4, 5]);
      const expected = new Set([3]);
      const results = SetUtils.intersection(sourceA, sourceB);
      global.expect(results).toEqual(expected);
    });
    global.it('can find intersection of set and array', () => {
      const sourceA = new Set([1, 2, 3]);
      const sourceB = [3, 4, 5];
      const expected = new Set([3]);
      const results = SetUtils.intersection(sourceA, sourceB);
      global.expect(results).toEqual(expected);
    });
    global.it('can find intersection of array and set', () => {
      const sourceA = [1, 2, 3];
      const sourceB = new Set([3, 4, 5]);
      const expected = new Set([3]);
      const results = SetUtils.intersection(sourceA, sourceB);
      global.expect(results).toEqual(expected);
    });
    global.it('can find intersection of array and array', () => {
      const sourceA = [1, 2, 3];
      const sourceB = [3, 4, 5];
      const expected = new Set([3]);
      const results = SetUtils.intersection(sourceA, sourceB);
      global.expect(results).toEqual(expected);
    });
    global.it('can find intersection where they do not intersect', () => {
      const sourceA = new Set([1, 2, 3]);
      const sourceB = new Set([4, 5, 6]);
      const expected = new Set([]);
      const results = SetUtils.intersection(sourceA, sourceB);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('setRemove', () => {
    global.it('can remove an individual item from a set', () => {
      const source = new Set([1, 2, 3, 4, 5]);
      const results = SetUtils.remove(source, 4, 5);
      const expected = new Set([1, 2, 3]);
      global.expect(results).toEqual(expected);
    });
    global.it('can remove a set', () => {
      const source = new Set([1, 2, 3, 4, 5]);
      const results = SetUtils.difference(source, new Set([4, 5]));
      const expected = new Set([1, 2, 3]);
      global.expect(results).toEqual(expected);
    });
    global.it('can remove a list', () => {
      const source = new Set([1, 2, 3, 4, 5]);
      const results = SetUtils.difference(source, [4, 5]);
      const expected = new Set([1, 2, 3]);
      global.expect(results).toEqual(expected);
    });
    global.it('can remove a list from a list', () => {
      const source = [1, 2, 3, 4, 5];
      const results = SetUtils.difference(source, [4, 5]);
      const expected = new Set([1, 2, 3]);
      global.expect(results).toEqual(expected);
    });
    global.it('throws an error if a non-iterable is asked to remove', () => {
      const source = new Set([1, 2, 3]);

      try {
        SetUtils.difference(source, 1);
        jest.fail('SetUtils: should throw an error if the items to remove is not iterable');
      } catch (err) {
        //
      }
    });
    global.it('removes nothing is target is null', () => {
      const source = new Set([1, 2, 3]);
      const target = null;
      const expected = new Set(source);
      const results = SetUtils.difference(source, target);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('find items not contained', () => {
    global.it('superset contains everything', () => {
      const expected = new Set();
      const possibleSuperSet = new Set([1, 2, 3, 4, 5, 6]);
      const subset = new Set([4, 5, 6]);
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
    global.it('superset missing one item', () => {
      const expected = new Set([7]);
      const possibleSuperSet = new Set([1, 2, 3, 4, 5, 6]);
      const subset = new Set([4, 5, 6, 7]);
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
    global.it('superset missing multiple', () => {
      const expected = new Set([7, 8, 9]);
      const possibleSuperSet = new Set([1, 2, 3, 4, 5, 6]);
      const subset = new Set([4, 5, 6, 7, 8, 9]);
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
    global.it('superset disjointed', () => {
      const expected = new Set([4, 5, 6]);
      const possibleSuperSet = new Set([1, 2, 3]);
      const subset = new Set([4, 5, 6]);
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
    global.it('identifies missing items in arrays', () => {
      const expected = new Set([7]);
      const possibleSuperSet = [1, 2, 3, 4, 5, 6];
      const subset = [4, 5, 6, 7];
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
    global.it('finds nothing if not an iteratable', () => {
      const expected = new Set();
      const possibleSuperSet = [1, 2, 3, 4, 5, 6];
      const subset = null;
      const result = SetUtils.findItemsNotContained(possibleSuperSet, subset);
      global.expect(result).toStrictEqual(expected);
    });
  });
});
