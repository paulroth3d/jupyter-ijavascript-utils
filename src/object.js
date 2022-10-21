/* eslint-disable no-param-reassign, max-len */

const schemaGenerator = require('generate-schema');

const FormatUtils = require('./format');

/**
 * Utility for working with and massaging javascript objects.
 * 
 * * Describe objects
 *   * {@link module:object.keys|keys()} - Safely get the keys of an object or list of objects
 *   * {@link module:object.getObjectPropertyTypes|getObjectPropertyTypes()} - describe the properties of a list of objects
 *   * {@link module:object.generateSchema|generateSchema()} - generate a schema / describe properties of a list of objects
 *   * {@link module:object.findWithoutProperties|findWithoutProperties()} - find objects without ALL the properties specified
 *   * {@link module:object.findWithoutProperties|findWithProperties()} - find objects with any of the properties specified
 *   * {@link module:object.setPropertyDefaults|setPropertyDefaults()} - sets values for objects that don't currently have the property
 *   * {@link module:object.propertyValueSample|propertyValueSample(collection)} - finds non-empty values for all properties found in the collection
 * * Manipulating objects
 *   * {@link module:object.objAssign|objAssign()} -
 *   * {@link module:object.objAssignEntities|objAssignEntities()} -
 *   * {@link module:object.selectObjectProperties|selectObjectProperties()} - keep only specific properties
 *   * {@link module:object.filterObjectProperties|filterObjectProperties()} - remove specific properties
 *   * {@link module:object.mapProperties|mapProperties(collection, fn, ...properties)} - map multiple properties at once (like parseInt, or toString)
 *   * {@link module:object.formatProperties|formatProperties(collection, propertyTranslation)} - map specific properties (ex: toString, toNumber, etc)
 * * Fetch child properties from related objects
 *   * {@link module:object.fetchObjectProperty|fetchObjectProperty(object, string)} - use dot notation to bring a child property onto a parent
 *   * {@link module:object.fetchObjectProperties|fetchObjectProperties(object, string[])} - use dot notation to bring multiple child properties onto a parent
 *   * {@link module:object.join|join(array, index, map, fn)} - join a collection against a map by a given index
 *   * {@link module:object.joinProperties|join(array, index, map, ...fields)} - join a collection, and copy properties over from the mapped object.
 *   * {@link module:object.propertyFromList|propertyFromList(array, propertyName)} - fetches a specific property from all objects in a list
 * * Rename properties
 *   * {@link module:object.cleanProperties|cleanProperties()} - correct inaccessible property names in a list of objects - in place
 *  *   * {@link module:object.cleanProperties2|cleanProperties2()} - correct inaccessible property names in a list of objects - on a cloned list
 *   * {@link module:object.cleanPropertyNames|cleanPropertyNames()} - create a translation of inaccessible names to accessible ones
 *   * {@link module:object.cleanPropertyName|cleanPropertyName()} - create a translation of a specific property name to be accessible.
 *   * {@link module:object.renameProperties|renameProperties()} - Use a translation from old property names to new ones
 * * Flatten object properties
 *   * {@link module:object.collapseSpecificObject|collapseSpecificObject()} - flatten object properties
 *   * {@link module:object.collapse|collapse()} - flatten specific object
 * * Create Map of objects by key
 *   * {@link module:object.mapByProperty|mapByProperty()} -
 *   * {@link module:group.by|group(collection, accessor)}
 * 
 * @module object
 * @exports object
 */
module.exports = {};

const ObjectUtils = module.exports;

//-- private methods

/**
 * Generates a function if a property or null or a function is sent
 * @param {Function | String} fnOrProp - 
 * @return {Function}
 * @private
 */
module.exports.evaluateFunctionOrProperty = function evaluateFunctionOrProperty(fnOrProp) {
  if (!fnOrProp) {
    return (r) => r;
  } else if (typeof fnOrProp === 'string') {
    return (r) => r[fnOrProp];
  } else if (typeof fnOrProp === 'function') {
    return fnOrProp;
  }

  throw (Error('Send either a Function or Property Name or null for a simple array'));
};

/**
 * Identifies keys from an object, but handles null safely.
 * @param {Object} - object to get the keys from
 * @return {Array<String>} - collections of keys or [] if no keys are found.
 * @private
 */
const keysFromObject = (obj) => {
  if (!obj) {
    return [];
  }
  return Object.keys(obj);
};

/**
 * Adds all items into a set
 */
const setAddAll = (iteratable, targetSet) => {
  iteratable.forEach((value) => targetSet.add(value));
  return targetSet;
};

//-- continued

/**
 * The maximum depth that a collapse will go to 
 * @type {Number}
 * @see {@link module:object.collapse|collapse()} - used with collapse
 */
module.exports.MAX_COLLAPSE_DEPTH = 50;

/**
 * Assign a property to an object and return object
 * (allowing for functional programming assignments)
 * @example objAssign({}, 'name', 'john').name === 'john'
 * @param {Object} [obj={}] - object to assign the value to (or null for a new one)
 * @param {String} propertyName -
 * @param {any} value -
 * @returns {Object}
 */
module.exports.assign = function objAssign(obj, propertyName, value, ...propertyNameValues) {
  if ((propertyName === null || propertyName === undefined)) {
    throw Error('Expecting at least one property name to be passed');
  } else if (typeof propertyName !== 'string') {
    throw Error(`Property must be a string:${propertyName}`);
  }

  if (!obj) obj = {};
  obj[propertyName] = value; //eslint-disable-line no-param-reassign

  if (propertyNameValues.length > 0) {
    ObjectUtils.objAssign.apply(ObjectUtils, [obj, ...propertyNameValues]);
  }

  return obj;
};
module.exports.objAssign = module.exports.assign;

/**
 * Assigns multiple object entities [[property, value], [property, value], ...];
 * 
 * @param {Object} [obj={}] - object to assign the values to
 * @param {Array} entities - 2d array [[property, value], ...]
 * @returns {Object}
 */
module.exports.assignEntities = function objAssignEntities(obj, entities) {
  if (!obj) obj = {};

  if (!Array.isArray(entities)) {
    throw Error('objAssignEntities: entities must be an array [[property, value]]');
  } else if (entities.length < 1) {
    throw Error('objAssignEntities: at least one entity must be sent');
  }

  entities.forEach(([property, value]) => {
    obj[property] = value;
  });

  return obj;
};
module.exports.objAssignEntities = module.exports.assignEntities;

/**
 * Runs a map over a collection, and adds properties the the objects.
 * 
 * @param {Object | Array<Object>} objCollection - object or collection of objects to augment
 * @param {Function | Object} mappingFn - (record) => {Object} mapping function <br />
 *            or object with properties to create 
 * @param {Boolean} [inPlace=false] - whether to update the collection in place (true) or cloned (false)
 * @returns {Array<Object>} - collection of records with the fields merged
 * @example
 * data = [{ source: 'A', value: 5 }, { source: 'B', value: 11 },
 *        { source: 'A', value: 6 }, { source: 'B', value: 13 },
 *        { source: 'A', value: 5 }, { source: 'B', value: 12 }];
 * utils.object.augment(data, (record) => ({ origin: 's_' + record.source }));
 * // returns
 * [{ source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 11, origin: 's_B' },
 *  { source: 'A', value: 6, origin: 's_A' }, { source: 'B', value: 13, origin: 's_B' },
 *  { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 12, origin: 's_B' }];
 * 
 * // by default `inPlace = false`, and data is not updated
 * data[0] // { source: 'A', value: 5 }
 * 
 * // if `inPlace = true`, then data would be updated
 * data[0] // { source: 'A', value: 5, origin: 's_A' }
 */
module.exports.augment = function augment(objCollection, mappingFn, inPlace = false) {
  const collection = Array.isArray(objCollection)
    ? objCollection
    : [objCollection];
  
  let results;
  if (inPlace) {
    collection.forEach((record) => {
      Object.assign(record, mappingFn(record));
    });
    results = collection;
  } else {
    results = collection.map((record) => ({ ...record, ...mappingFn(record) }));
  }

  return results;
};

/**
 * Creates a map of a list of objects based on a specific property
 * @param {Object[]} collection - collection of objects
 * @param {Function | String} propertyOrFn - Name of the property or Function to return a value
 * @returns {Map<String, Object>} - map using the propertyName as the key
 * @see {@link module:group.by|group(collection, propertyOrFn)} - if there is a possibility the records are not unique
 * @example
 * const data = [{ id: '123', name: 'jim' },
 *    { id: '456', name: 'mary' },
 *    { id: '789', name: 'sue' }];
 * mapByProperty(data, 'id');
 * // Map(
 * //      '123': { id: '123', name: 'jim' },
 * //      '456': { id: '456', name: 'mary' },
 * //      '789': { id: '789', name: 'sue' });
 */
module.exports.mapByProperty = function mapByProperty(collection, propertyOrFn) {
  if (!propertyOrFn) throw new Error('object.mapByProperty: expects a propertyName');

  const cleanedFunc = ObjectUtils.evaluateFunctionOrProperty(propertyOrFn);
  
  return (collection || []).reduce(
    (result, entry) => {
      result.set(cleanedFunc(entry), entry);
      return result;
    }, new Map()
  );
};

/**
 * Safely gets the keys from an object or array of objects
 * NOTE: much faster on object, as it will assume it needs to check all items in the array.
 * 
 * This can be quite helpful to understand a list of objects that are not uniform in properties.
 * @param {(Object|Array)} objOrArray - a collection of objects (or a single object)
 * @param {Number} [maxRows=-1] - optional param - maximum number of rows to investigate
 *  for new keys if array passed. (ex: 2 means only investigate the first two rows)
 * @returns {String[]} - array of all the keys found
 * @see {@link module:describe.describeObjects}
 * @example
 * 
 * //-- finding all properties from a heterogeneous list
 * collection = [{ name: 'john', age: 23 }, { name: 'jane', age: 24, score: 4.0 }];
 * utils.object.keys(collection); // ['name', 'age', 'score']
 * 
 * //-- or using map on those keys
 * result = { name: 'john', age: 23, score: 4.0 };
 * utils.object.keys(result)
 *    .map(key => `${key}:${result[key]}`);  //-- you can now run map methods on those keys
 */
module.exports.keys = function keys(objOrArray = {}, maxRows = -1) {
  if (!Array.isArray(objOrArray)) {
    return keysFromObject(objOrArray);
  }

  const result = new Set();
  if (maxRows < 1) {
    objOrArray.every((item, index) => setAddAll(keysFromObject(item), result));
  } else {
    //-- check 
    objOrArray.every((item, index) => {
      if (index >= maxRows) {
        return false;
      }
      setAddAll(keysFromObject(item), result);
      return true;
    });
  }
  return Array.from(result);
};

/**
 * Cleans all the properties of the array of objects in place (does not make Copies)
 * 
 * **NOTE: This is faster than {@link module:ObjectUtils.cleanProperties2|cleanProperties2},
 * but the standard order of the properties (using Object.keys) will be altered.**
 * 
 * @param {Object[]} objectsToBeCleaned -
 * @return {Object[]} - cleaned objects
 */
module.exports.cleanProperties = function cleanProperties(objectsToBeCleaned) {
  return ObjectUtils.renameProperties(
    objectsToBeCleaned,
    ObjectUtils.cleanPropertyNames(objectsToBeCleaned)
  );
};

/**
 * Labels and Values from {@link module:object.cleanProperties2|object.cleanProperties2}
 * 
 * ```
 * {
 *   labels: { date: 'date', kind: 'kind', num: 'num' },
 *   values: [
 *     { date: ' 2021-07-11T22:23:07+0100', kind: ' s', num: '192' },
 *     { date: ' 2021-07-09T19:54:48+0100', kind: ' c', num: '190' },
 *     { date: ' 2021-07-08T17:00:32+0100', kind: ' s', num: '190' }
 *   ]
 * };
 * ```
 * 
 * @typedef {Object} CleanedProperties
 * @property {Object} labels - an object with translations of the fields and labels
 * @property {String} labels.property - for each translated property, stores the original property name
 * @property {Object[]} values - cleaned values
 
 */

/**
 * Cleans properties on clones of objects.
 * 
 * Additionally, this returns a mapping of what the properties used to be named,
 * as this can be helpful for rendering out tables.
 * 
 * @param {Object[]} objectsToBeCleaned - collection of objects to be cleaned
 * @returns {CleanedProperties} - { labels: Object - propertyName:originalProperty, values: cleaned collection }
 * @see {@link module:object~CleanedProperties}
 * @example
const badData = [
  { '"name"': 'john', num: '192', ' kind': ' s', '1st date': ' 2021-07-11T22:23:07+0100' },
  { '"name"': 'jane', num: '190', ' kind': ' c', '1st date': ' 2021-07-09T19:54:48+0100' },
  { '"name"': 'ringo', num: '190', ' kind': ' s', '1st date': ' 2021-07-08T17:00:32+0100' }
];
const cleaned = objectUtils.cleanProperties2(badData);
// {
//   labels: { 1st_date: '1st date', kind: 'kind', num: 'num' },
//   values: [
//     { name: 'john', num: '192', kind: ' s', '1st_date': ' 2021-07-11T22:23:07+0100' },
//     { name: 'jane', num: '190', kind: ' c', '1st_date': ' 2021-07-09T19:54:48+0100' },
//     { name: 'ringo', num: '190', kind: ' s', '1st_date': ' 2021-07-08T17:00:32+0100' }
//   ]
// }
 */
module.exports.cleanProperties2 = function cleanProperties2(objectsToBeCleaned) {
  const cleanedPropertyNames = ObjectUtils.cleanPropertyNames(objectsToBeCleaned);
  const keys = ObjectUtils.keys(cleanedPropertyNames);

  const translation = keys.reduce((result, key) => ObjectUtils
    .objAssign(result, cleanedPropertyNames[key], ObjectUtils.lightlyCleanProperty(key)), {});
  
  const values = (objectsToBeCleaned || [])
    .map((obj) => keys.reduce(
      (result, key) => ObjectUtils.objAssign(result, cleanedPropertyNames[key], obj[key]),
      {}
    ));
  
  return ({ labels: translation, values });
};

/**
 * cleans properties so they are still legible
 * @private
 * @param {String} propertyName - property name to be cleaned
 * @returns {String}
 */
module.exports.lightlyCleanProperty = function lightlyCleanProperty(propertyName) {
  //-- assume property name is a string
  return propertyName.trim()
    .replace(/^["']/, '')
    .replace(/['"]$/, '');
};

/**
 * Cleans the list of object keys - likely from a CSV
 * @param {(Object| String[])} objectKeys -
 * @return {Object} - object with key:value as original:new
 */
module.exports.cleanPropertyNames = function cleanPropertyNames(target) {
  let originalKeys;
  if (!target) {
    return {};
  } else if (Array.isArray(target)) {
    if ((typeof target[0]) === 'string') {
      originalKeys = target;
    } else {
      originalKeys = ObjectUtils.keys(target);
    }
  } else {
    originalKeys = Object.keys(target);
  }

  const result = {};
  originalKeys.forEach((key) => {
    result[key] = ObjectUtils.cleanPropertyName(key);
  });
  return result;
};

/**
 * Cleans an individual property
 * @param {String} property -
 * @returns {String}
 */
module.exports.cleanPropertyName = function cleanPropertyName(property) {
  const cleanProperty = property.trim()
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, '_');
  return cleanProperty;
};

const renameObjectProperties = function renameObjectProperties(object, originalKeys, targetKeys) {
  const result = { ...object };
  originalKeys.forEach((originalKey, index) => {
    const targetKey = targetKeys[index];
    if (targetKey !== originalKey) {
      result[targetKey] = result[originalKey];
      delete result[originalKey];
    }
  });
  return result;
};

/**
   * Property Reassign - either against a single object or an array of objects
   * @example renameProperties(
   *  { '"first name"': 'john', '"last name"': 'doe' }, {'"first name"':'first_name'}
   *  ).deepEquals({first_name: 'john', '"last name"': 'doe'})
   * @param {Object[]} objects - objects to reassign - likely from a CSV
   * @param {Object} propertyTranslations - where property:value is original:new
   * @returns {Object[]}
   */
module.exports.renameProperties = function renameProperties(objects, propertyTranslations) {
  const originalKeys = Object.keys(propertyTranslations);
  const targetKeys = Object.values(propertyTranslations);

  if (Array.isArray(objects)) {
    return objects.map(
      (object) => renameObjectProperties(object, originalKeys, targetKeys)
    );
  }
  return renameObjectProperties(objects, originalKeys, targetKeys);
};

const collapseSpecificObject = function collapseSpecificObject(sourceObj, targetObj, depth) {
  if (depth > ObjectUtils.MAX_COLLAPSE_DEPTH) return;
  if (targetObj) {
    const targetObjProperties = Object.getOwnPropertyNames(targetObj);
    targetObjProperties.forEach((prop) => {
      const propType = typeof targetObj[prop];
      if (propType === 'object') {
        collapseSpecificObject(sourceObj, targetObj[prop], depth + 1);
      } else {
        sourceObj[prop] = targetObj[prop];
      }
    });
  }
  return sourceObj;
};

/**
 * Collapse an object tree into a single object with all the properties.
 * @example
 * const targetObj = { make: 'Ford', model: 'F150', driver: {firstName:'John', lastName:'doe'}};
 * const collapsed - utils.collapse(targetObj);
 * console.log(`Hi ${collapsed.firstName}, how do you like your ${collapsed.model}?`);
 * // 'Hi John, how do you like your F150?
 * @param {Object} objectTree
 * @returns {Object} - object with all the properties added
 * @see #MAX_COLLAPSE_DEPTH - 
 */
module.exports.collapse = function collapse(targetObj) {
  return collapseSpecificObject({}, targetObj, 0);
};

/**
 * Keeps only specific properties on an object or list of objects
 * @param {Object | Object[]} list - collection of objects to filter
 * @param {String[]} propertyNames - list of the only properties to keep
 * @returns {Object[]}
 */
module.exports.selectObjectProperties = function selectObjectProperties(list, ...propertyNames) {
  const cleanPropertyNames = propertyNames.length > 0 && Array.isArray(propertyNames[0])
    ? propertyNames[0]
    : propertyNames;

  if (!list) return [];
  const targetList = Array.isArray(list) ? list : [list];

  return targetList.map(
    (record) => cleanPropertyNames.reduce(
      (result, prop) => ObjectUtils.objAssign(result, prop, record[prop]), {}
    )
  );
};

/**
 * Removes specific properties on an object or list of objects
 * @param {Object | Object[]} list - collection of objects to filter
 * @param {String[]} propertyNames - list of the only properties to keep
 * @returns {Object[]}
 */
module.exports.filterObjectProperties = function filterObjectProperties(list, propertyNames) {
  if (!list) return [];
  const targetList = Array.isArray(list) ? list : [list];
  return targetList.map((obj) => {
    const clone = { ...obj };
    propertyNames.forEach((propertyToRemove) => delete clone[propertyToRemove]);
    return clone;
  });
};

/**
 * Options for fetching object properties
 * @typedef {Object} FetchObjectOptions
 * @property {Boolean} safeAccess - whether to safely access, even if the path cannot be found
 * @property {Boolean} append - whether to only return the properties (default) or append
 */

/**
 * Fetches multiple properties from an object or list of objects.
 * @param {Object | Object[]} list - collection of objects to reduce
 * @param {Map<String,any>} propertyNames - Object with the keys as the properties
 *    and the values using dot notation to access related records and properties
 *    (ex: {parentName: 'somePropertyObject.parent.parent.name', childName: 'child.Name'})
 * @param {FetchObjectOptions} options - {@link module:object~FetchObjectOptions|See FetchObjectOptions} 
 * @returns {Object[]} - objects with the properties resolved
 *    (ex: {parentname, childName, etc.})
 */
module.exports.fetchObjectProperties = function fetchObjectProperties(list, propertyNames, options = {}) {
  const {
    //-- whether to safely access even if object path cannot be found
    safeAccess = false,

    //-- whether to fetch only those specific properties, or append to the object
    append = false
  } = options;

  if (!list) return [];
  const targetList = Array.isArray(list) ? list : [list];

  const props = Object.getOwnPropertyNames(propertyNames);

  return targetList.map((obj) => {
    const result = append ? { ...obj } : {};
    props.forEach((prop) => {
      result[prop] = ObjectUtils.fetchObjectProperty(obj, propertyNames[prop], safeAccess);
    });
    return result;
  });
};

/**
 * Accesses a property using a string
 * @param {Object} obj - object to access the properties on
 * @param {String} propertyAccess - dot notation for the property to access
 *    (ex: `parent.obj.Name`)
 * @param {FetchObjectOptions} options - {@link module:object~FetchObjectOptions|See FetchObjectOptions}
 * @returns {any} - the value accessed at the end ofthe property chain
 */
module.exports.fetchObjectProperty = function fetchObjectProperty(obj, propertyAccess, safeAccess) {
  if (!obj || !propertyAccess) return null;

  //-- @TODO - should we be safe or support elvis operators?
  return propertyAccess.split('.')
    .reduce((currentVal, prop) => {
      if (currentVal) {
        return currentVal[prop];
      } else if (safeAccess || prop[0] === '?') {
        return null;
      }
      throw Error(`Invalid property ${propertyAccess} [${prop}] does not exist - safeAccess:${safeAccess}`);
    }, obj);
};

/**
 * Translates specific properties to a new value on an object, or collection of objects.
 * 
 * The properties defined in the `propertyTranslations` argument is then the property to be updated. (All other properties remain the same)
 * 
 * You can either provide a function accepting the current value and returning the new value (any) => any
 * 
 * Or you can provide one of the common shorthands:
 * 
 * * 'string'
 * * 'float' or 'number'
 * * 'int' or 'integer'
 * * 'boolean'
 * 
 * ```
 * data = [
 *   {station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123'},
 *   {station: 'A', isFahreinheit: 'TRUE', offset: '2', temp: 99, type: 'F', descr: '0123456'},
 *   {station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789'}
 * ];
 * 
 * utils.object.format(data, ({
 *   //-- to a literal value
 *   type: 'C',
 *   //-- convert it to 'string', 'number' || 'float', 'int' || 'integer', 'boolean'
 *   offset: 'number',
 *   isFahreinheit: 'boolean',
 *   //-- or convert the value with a function accepting the current value
 *   //-- and returning the new value
 *   temp: (val) => (val - 32) * 0.5556
 * }));
 * 
 * // [
 * //   { station: 'A', isFahreinheit: true, offset: 0, temp: 36.669599999999996, type: 'C', descr: '0123' },
 * //   { station: 'A', isFahreinheit: true, offset: 2, temp: 37.2252, type: 'C', descr: '0123456' },
 * //   { station: 'A', isFahreinheit: false, offset: 3, temp: 37.7808, type: 'C', descr: '0123456789' }
 * // ];
 * ```
 * 
 * **Please note, you can pass a single object to be cleaned**,<br /> but it will be returned as an array of one object.
 * 
 * ```
 * data = [{station: 'A', isFahreinheit: 'TRUE', offset: '2', temp: 99, type: 'F', descr: '0123456'}];
 * 
 * utils.object.format(data, ({
 *   //-- convert it to 'string', 'number' || 'float', 'int' || 'integer', 'boolean'
 *   offset: 'number',
 *   isFahreinheit: 'boolean'
 * }));
 * 
 * // [{station: 'A', isFahreinheit: true, offset: 2, temp: 99, type: 'F', descr: '0123456'}];
 * ```
 * 
 * @param {Object} collection - the list of objects to update specific properties
 * @param {Object} propertyTranslations - An object with property names as the properties to update <br />
 *      and the values as a function ((any) => any) accepting the current value, returning the new value.
 * @returns {Object[]} - collection of objects transformed
 * @see {@link module:object.augment|augment(collection, fn)} - to add in new properties
 * @see {@link TableGenerator#formatter} - for other examples
 */
module.exports.formatProperties = function formatProperties(collection, propertyTranslations) {
  const cleanCollection = !collection ? []
    : Array.isArray(collection) ? collection : [collection];
  
  propertyTranslations = FormatUtils.prepareFormatterObject(propertyTranslations);
  const translationKeys = Array.from(Object.keys(propertyTranslations));
  
  return cleanCollection.map((obj) => {
    const clone = { ...obj };
    translationKeys.forEach((key) => {
      clone[key] = propertyTranslations[key](clone[key]);
    });
    return clone;
  });
};

/**
 * returns a map of the types of fields stored
 * @see generateSchema
 * @param {Object | Object[]} list - collection of objects to check
 * @returns {Map<String, Set<String>>} - collection of the types and the fields of those types
 */
module.exports.getObjectPropertyTypes = function getObjectPropertyTypes(list) {
  const targetList = !list ? [] : Array.isArray(list) ? list : [list];
  const results = new Map();
  let type;

  targetList.forEach((r) => {
    if (r) {
      Object.keys(r).forEach((key) => {
        type = typeof r[key];
        if (r[key] === null || r[key] === undefined) {
          //-- do nothing
        } else if (!results.has(type)) {
          results.set(type, new Set([key]));
        } else {
          results.get(type).add(key);
        }
      });
    }
  });

  return results;
};

/**
 * Generates a JSON schema for an object
 * @see https://github.com/Nijikokun/generate-schema
 * @param {any} targetObj - object or array of objects
 * @returns {Object} - JSON Schema
 */
module.exports.generateSchema = function generateSchema(targetObj) {
  return schemaGenerator.json(targetObj);
};

/**
 * Join values from an objectArray to a JavaScript Map.
 * 
 * For example:
 * 
 * ```
 * weather = [
 *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
 *   null,
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
 * ];
 * 
 * cityLocations = new Map([
 *   ['Chicago', { locationId: 1, city: 'Chicago', lat: 41.8781, lon: 87.6298 }],
 *   ['New York', { locationId: 2, city: 'New York', lat: 40.7128, lon: 74.0060 }],
 *   ['Seattle', { locationId: 3, city: 'Seattle', lat: 47.6062, lon: 122.3321 }]
 * ]);
 * 
 * utils.object.join(weather, 'city', cityLocations, (weather, city) => ({...weather, ...city}));
 * // [
 * //    {id:1, city:'Seattle',  month:'Aug', precip:0.87, locationId:3, lat:47.6062, lon:122.3321 },
 * //    null,
 * //    {id:3, city:'New York', month:'Apr', precip:3.94, locationId:2, lat:40.7128, lon:74.006 },
 * //    {id:6, city:'Chicago',  month:'Apr', precip:3.62, locationId:1, lat:41.8781, lon:87.6298 }
 * // ]
 * ```
 * 
 * or join by lookup:
 * 
 * ```
 * utils.object.join(weather, 'city', cityLocations, (weather, city) => ({...weather, city}));
 * [
 *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, city:
 *     { city: 'Seattle', locationId: 3, lat: 47.6062, lon: 122.3321 }
 *   },
 *   null,
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94, city:
 *     { city: 'New York', locationId: 2, lat: 40.7128, lon: 74.006 }
 *   },
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, city:
 *     { city: 'Chicago', locationId: 1, lat: 41.8781, lon: 87.6298 }
 *   }
 * ];
 * ```
 * 
 * or performing a translation / calculate the index instead of a property:
 * 
 * ```
 * const indexingFn = (weather) => `${weather.country}_${weather.city}`;
 * utils.object.join(weather, indexingFn, cityLocations, (weather, city) => ({...weather, ...city}));
 * // ...
 * ```
 * 
 * The signature for the indexingFunction is `(sourceObj:Object): {any}` - providing the index to use against the map.
 * 
 * The signature for the mapping function is `(sourceObj:Object, mappedObject:Object) => {Object}`.
 * 
 * If the mappedObject could not be found by that index (left join), then mappedObject will be `null`.
 * 
 * As the results of the functions are mapped, you can either modify in-line (directly on the object),
 * or on a clone of the object (ex: {...sourceObj})
 * 
 * Note, performing a JavaScript .map() call may be more performant in some cases,
 * so consider it for more complex options.
 * 
 * **Note: indexField can be either a string name of the field to join,
 * or a function to be passed the object and generate the index**
 * 
 * @param {Array<Object>} objectArray - collection of objects to join based on the target map
 * @param {Function | String} indexField - property on each object in array to lookup against target map <br />
 *      Signature if a function: `(sourceObj:Object): {any}`
 * @param {Map} targetMap - Map with keys mapping to values to pass
 * @param {Function} joinFn - function to call each time an objectArray object, has an indexField found in targetMap <br />
 *      Signature: `(sourceObj:Object, mappedObject:Object) => {Object}`
 * @returns {Array<Object>} - Array of results returned from `joinFn`
 */
module.exports.join = function join(objectArray, indexField, targetMap, joinFn) {
  const cleanArray = !objectArray
    ? []
    : Array.isArray(objectArray)
      ? objectArray
      : [objectArray];

  const indexFn = ObjectUtils.evaluateFunctionOrProperty(indexField);

  if (!targetMap) {
    throw Error('object.join(objectArray, indexField, targetMap, joinFn): targetMap cannot be null');
  }

  if (!joinFn || typeof joinFn !== 'function') {
    throw Error('object.join(objectArray, indexField, targetMap, joinFn): joinFn is required');
  }
  
  const results = cleanArray.map((entry) => {
    if (!entry) return entry;

    const index = indexFn(entry);
    
    const target = targetMap.has(index)
      ? targetMap.get(index)
      : null;

    const result = joinFn(entry, target);

    return result;
  });

  return results;
};

/**
 * For cases where we simply want to pull values from one object to another.
 * 
 * For example:
 * 
 * ```
 * weather = [
 *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
 *   null,
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
 * ];
 * 
 * cityLocations = new Map([
 *   ['Chicago', { locationId: 1, city: 'Chicago', lat: 41.8781, lon: 87.6298 }],
 *   ['New York', { locationId: 2, city: 'New York', lat: 40.7128, lon: 74.0060 }],
 *   ['Seattle', { locationId: 3, city: 'Seattle', lat: 47.6062, lon: 122.3321 }]
 * ]);
 * 
 * utils.object.joinProperties(weather, 'city', cityLocations, 'lat', 'lon'));
 * // [
 * //    {id:1, city:'Seattle',  month:'Aug', precip:0.87, lat:47.6062, lon:122.3321 },
 * //    null,
 * //    {id:3, city:'New York', month:'Apr', precip:3.94, lat:40.7128, lon:74.006 },
 * //    {id:6, city:'Chicago',  month:'Apr', precip:3.62, lat:41.8781, lon:87.6298 }
 * // ]
 * ```
 * 
 * @param {Array<Object>} objectArray - collection of objects to join based on the target map
 * @param {Function | String} indexField - property on each object in array to lookup against target map <br />
 *      Signature if a function: `(sourceObj:Object): {any}`
 * @param {Map<any,Object>} targetMap - Map with keys mapping to values to pass
 * @param {...String} fields - List of fields to add to the objectArray in-place against values from targetMap
 * @returns {Array<Object>} - The modified objectArray with the fields applied.
 */
module.exports.joinProperties = function join(objectArray, indexField, targetMap, ...fields) {
  const cleanFields = fields.filter((f) => f);
  if (cleanFields.length < 1) {
    throw Error('object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join');
  }

  const joinFn = (sourceObj, targetObj) => {
    const cleanTarget = targetObj || {};
    //-- allow for direct manipulation for speed
    const result = sourceObj; // { ...sourceObj };

    cleanFields.forEach((field) => {
      result[field] = cleanTarget[field];
    });

    return result;
  };

  return ObjectUtils.join(objectArray, indexField, targetMap, joinFn);
};

/**
 * Maps an array of values to a single property.
 * 
 * For example:
 * 
 * ```
 * const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
 *  { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
 *  { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
 *  { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
 *  { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
 * ];
 * 
 * utils.object.propertyFromList(data, 'val')
 * //-- [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * 
 * utils.object.propertyFromList(data, (r) => r.val);
 * //-- [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * ```
 * 
 * @param {Object[]} objectArray - Array of Objects to be mapped to a single property / value
 * @param {Function | String} propertyOrFn - Name of the property or Function to return a value
 * @returns {Array} - Array of values
 */
module.exports.propertyFromList = function propertyFromList(objectArray, propertyOrFn) {
  const cleanArray = Array.isArray(objectArray)
    ? objectArray
    : [];
  
  const fn = ObjectUtils.evaluateFunctionOrProperty(propertyOrFn);

  return cleanArray.map(fn);
};

/**
 * Finds objects that do not have ALL the properties specified.
 *
 * This can be very helpful in ensuring all objects actually meet a specification and are not missing values.
 * 
 * ```
 * const students = [
 *   { first: 'john', last: 'doe', age: 23 }, { first: 'jane', last: 'doe', age: 23 }, { first: 'jack', last: 'white', failure: 401 }
 * ];
 *
 * utils.findWithoutProperties(students, 'first', 'last', 'age');
 * // [{ first: 'jack', last: 'white', failure: 401 }]
 * 
 * utils.findWithoutProperties(students, 'failure');
 * // [{ first: 'john', last: 'doe', age: 23 }, { first: 'jane', last: 'doe', age: 23 }] 
 * ```
 *
 * Please note, that we can check a single object:
 *
 * ```
 * utils.findWithoutProperties(students[0], 'failure');
 * // []
 * ```
 * 
 * @param {Object[]} objectsToCheck - the array of objects to check for the properties.
 * @param {...String} propertiesToFind - the list of properties to find within the collection.
 * @returns {Object[]} - Array of objects that are missing at least one of those properties
 * @see {@link module:file.findWithProperties|findWithProperties} - if you want objects that do not have all properties
 **/
module.exports.findWithoutProperties = function findWithoutProperties(targetObj, ...propertiesToFind) {
  const cleanProperties = propertiesToFind.length > 0 && Array.isArray(propertiesToFind[0])
    ? propertiesToFind[0]
    : propertiesToFind;
  
  const cleanTargets = Array.isArray(targetObj)
    ? targetObj
    : [targetObj];
  
  const results = [];
      
  cleanTargets.forEach((target) => {
    if (cleanProperties.find((prop) => (typeof target[prop]) === 'undefined')) {
      results.push(target);
    }
  });
  
  return results;
};

/**
 * Finds objects that have any of the properties specified.
 * 
 * This can be very helpful when working with datasets that include mixed data (such as JSON)
 * 
 * ```
 * const students = [
 *   { first: 'john', last: 'doe' }, { first: 'jane', last: 'doe' }, { first: 'jack', last: 'white', failure: 401 }
 * ];
 *
 * utils.findWithProperties(students, 'failure');
 * // { first: 'jack', last: 'white', failure: 401 }
 * ```
 *
 * Please note, that we can check a single object:
 *
 * ```
 * utils.findWithProperties({ first: 'john', last: 'doe' }, 'failure');
 * // []
 * ```
 * 
 * @param {Object[]} objectsToCheck - the array of objects to check for the properties.
 * @param {...String} propertiesToFind - the list of properties to find within the collection.
 * @returns {Object[]} - Array of objects that have at least one of those properties
 * @see {@link module:file.findWithoutProperties|findWithoutProperties} - if you want objects that do not have all properties
 **/
module.exports.findWithProperties = function findWithProperties(targetObj, ...propertiesToFind) {
  const cleanProperties = propertiesToFind.length > 0 && Array.isArray(propertiesToFind[0])
    ? propertiesToFind[0]
    : propertiesToFind;

  const cleanTargets = Array.isArray(targetObj)
    ? targetObj
    : [targetObj];
   
  const results = [];
       
  cleanTargets.forEach((target) => {
    if (cleanProperties.find((prop) => (typeof target[prop]) !== 'undefined')) {
      results.push(target);
    }
  });

  return results;
};

/**
 * Sets values for objects that don't currently have the property
 * 
 * This is very helpful for ensuring that all objects have a property,
 * or setting a value to make it easier to identify that it is 'N/A'
 * 
 * Note, that only the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty|ownProperties}
 * on the default object are checked.
 * 
 * And values are applied to the target object, only if the property is not on the object (property is undefined)
 * 
 * @param {Object[] | Object} targetObject - Object to apply the properties to <br />
 *              but ONLY if the object does not have that property (ex: undefined)
 * @param {Object} defaultObj - Object with the properties and defaults applied
 * @param {any} defaultObj.property - the property to check, with the default value assigned
 * @see {@link module:file.findWithoutProperties|findWithoutProperties} - to determine if any objects do not have a set of properties
 * @see {@link module:file.keys|keys} - to get a list of unique properties of all objects in a list.
 * @example
 * const students = [
 *   { first: 'john', last: 'doe', birthday: '2002-04-01' },
 *   { first: 'jane', last: 'doe', birthday: '2003-05-01' },
 *   { first: 'jack', last: 'white', failure: 401 }
 * ];
 * 
 * utils.object.setPropertyDefaults(students, {
 *  first: '',
 *  last: '',
 *  birthday: ''
 * });
 * 
 * // [
 * //   { first: 'john', last: 'doe', birthday: '2002-04-01' },
 * //   { first: 'jane', last: 'doe', birthday: '2003-05-01' },
 * //   { first: 'jack', last: 'white', birthday: '', failure: 401 }
 * // ];
 */
module.exports.setPropertyDefaults = function setPropertyDefaults(targetObject, defaultObj) {
  const cleanTargets = Array.isArray(targetObject)
    ? targetObject
    : [targetObject];
  
  if (!defaultObj || typeof defaultObj !== 'object') {
    throw Error('object.setPropertyDefaults(targetObject, defaultObject): defaultObject is expected to be an object with properties set to the defaults to apply');
  }

  const defaultKeys = Object.getOwnPropertyNames(defaultObj);

  cleanTargets.forEach((target) => {
    defaultKeys.forEach((prop) => {
      if (typeof target[prop] === 'undefined') {
        target[prop] = defaultObj[prop];
      }
    });
  });
};

/**
 * Applies a function to a set of properties on an object, or collection.
 * 
 * This is shorthand for a mapping function,
 * but useful if doing the same operation (like converting to compactNumbers, converting to string, etc)
 * 
 * For example, the two are equivalent:
 * 
 * ```
 * const list = [
 *  { id: '100', age: '21', name: 'p1' },
 *  { id: '200', age: '22', name: 'p2' },
 *  { id: '300', age: '23', name: 'p3' },
 *  { id: '400', age: '24', name: 'p4' },
 *  { id: '500', age: '25', name: 'p5' }
 * ];
 * 
 * const numToString = (val) => String(val);
 * 
 * const listMapProperties = utils.object.mapProperties(list, numToString, 'id', 'val');
 * 
 * const listMap = list.map((obj) => ({
 *  ...obj,
 *  id: numToString(obj.val),
 *  age: numToString(obj.val)
 * }));
 * ```
 * 
 * @param {Object[]} objCollection - object or multiple objects that should have properties formatted
 * @param {Function} formattingFn - function to apply to all the properties specified
 * @param  {...any} propertiesToFormat - list of properties to apply the formatting function
 * @returns {Object[] - clone of objCollection with properties mapped
 */
module.exports.mapProperties = function mapProperties(objCollection, formattingFn, ...propertiesToFormat) {
  const cleanCollection = !Array.isArray(objCollection)
    ? [objCollection]
    : objCollection;

  const cleanProperties = propertiesToFormat.length > 0 && Array.isArray(propertiesToFormat[0])
    ? propertiesToFormat[0]
    : propertiesToFormat;
  
  if (typeof formattingFn !== 'function') {
    throw Error('object.mapProperties(collection, formattingFn, ...propertiesToFormat): formattingFn must be provided');
  }
  
  return cleanCollection.map((obj) => {
    const clone = { ...obj };
    cleanProperties.forEach((prop) => {
      clone[prop] = formattingFn(obj[prop]);
    });
    return clone;
  });
};

/**
 * Finds all the properties for objects in a collection,
 * and provides the first 'non-empty' value found of each property.
 * 
 * Non-Empty means:
 * 
 * * not null
 * * not undefined
 * * not an empty string
 * * not an empty array
 * 
 * This can be especially helpful for heterogeneous collections
 * and can be much faster than something like {@link https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.describe|danfojs.describe}
 * 
 * @param {Object[]} objCollection - Array of objects that we want to understand
 * @returns {Map<String,any>} - Collection of all properties and the first 'non-empty' value found
 * @example
 * let collection = [
 *  { first: 'jane', age: 23 },
 *  { first: 'john', last: 'doe', age: 21 }
 * ];
 * 
 * utils.object.propertyValueSample(collection);
 * // { first: 'jane', last: 'doe', age: 23 }
 */
module.exports.propertyValueSample = function propertyValueSample(objCollection) {
  if (!objCollection) {
    throw new Error('propertyValueSample(objectCollection): objectCollection is required');
  }

  const collection = Array.isArray(objCollection) ? objCollection : [objCollection];

  const result = new Map();
  let entryValue;

  collection.forEach((entry) => {
    if (entry && (typeof entry) === 'object') {
      for (const entryProperty of Object.keys(entry)) {
        entryValue = entry[entryProperty];
        if (
          !FormatUtils.isEmptyValue(entryValue)
          && !result.has(entryProperty)
        ) {
          result.set(entryProperty, entryValue);
        }
      }
    }
  });

  return result;
};
