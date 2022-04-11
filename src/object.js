/* eslint-disable no-param-reassign */

const schemaGenerator = require('generate-schema');

/**
 * Utility for working with and massaging javascript objects.
 * 
 * * Describe objects
 *   * {@link module:object.keys|keys()} - Safely get the keys of an object or list of objects
 *   * {@link module:object.getObjectPropertyTypes|getObjectPropertyTypes()} - describe the properties of a list of objects
 *   * {@link module:object.generateSchema|generateSchema()} - generate a schema / describe properties of a list of objects
 * * Manipulating objects
 *   * {@link module:object.objAssign|objAssign()} -
 *   * {@link module:object.objAssignEntities|objAssignEntities()} -
 *   * {@link module:object.selectObjectProperties|selectObjectProperties()} - keep only specific properties
 *   * {@link module:object.filterObjectProperties|filterObjectProperties()} - remove specific properties
 * * fetch child properties onto parents
 *   * {@link module:object.fetchObjectProperties|fetchObjectProperties()} - use dot notation to bring multiple child properties onto a parent
 *   * {@link module:object.fetchObjectProperty|fetchObjectProperty()} - use dot notation to bring a child property onto a parent
 * * Rename properties
 *   * {@link module:object.cleanProperties|cleanProperties()} - correct inaccessible property names in a list of objects
 *   * {@link module:object.cleanPropertyNames|cleanPropertyNames()} - create a translation of inaccessible names to accessible ones
 *   * {@link module:object.cleanPropertyName|cleanPropertyName()} - create a translation of a specific property name to be accessible.
 *   * {@link module:object.renameProperties|renameProperties()} - Use a translation from old property names to new ones
 * * flatten object properties
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
module.exports.objAssign = function objAssign(obj, propertyName, value, ...propertyNameValues) {
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

/**
 * Assigns multiple object entities [[property, value], [property, value], ...];
 * 
 * @param {Object} [obj={}] - object to assign the values to
 * @param {Array} entities - 2d array [[property, value], ...]
 * @returns {Object}
 */
module.exports.objAssignEntities = function objAssignEntities(obj, entities) {
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

/**
 * Runs a map over a collection, and adds properties the the objects.
 * 
 * @param {Object | Array<Object>} objCollection - object or collection of objects to augment
 * @param {Function} mappingFn - (record) => {Object} mapping function
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
 * @param {String} propertyName - the name of the property to map on
 * @returns {Map<String, Object>} - map using the propertyName as the key
 * @see {@link module:group.by|group(collection, accessor)} - if there is a possibility the records are not unique
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
module.exports.mapByProperty = function mapByProperty(collection, propertyName) {
  if (!propertyName) throw new Error('object.mapByProperty: expects a propertyName');
  
  return (collection || []).reduce(
    (result, entry) => {
      result.set(entry[propertyName], entry);
      return result;
    }, new Map()
  );
};

/**
 * Safely gets the keys from an object or array of objects
 * NOTE: much faster on object, as it will assume it needs to check all items in the aray
 * @param {(Object|Array)} objOrArray -
 * @returns {String[]} - list of all the keys found
 */
module.exports.keys = function keys(objOrArray = {}) {
  if (!Array.isArray(objOrArray)) {
    return keysFromObject(objOrArray);
  }

  const result = new Set();
  objOrArray.forEach((item) => setAddAll(keysFromObject(item), result));
  return Array.from(result);
};

/**
 * Cleans all the properties of the array of objects
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
 * Cleans the list of object keys - likely from a CSV
 * @param {(Object| String[])} objectKeys -
 * @return {Object} - object with key:value as original:new
 */
module.exports.cleanPropertyNames = function cleanPropertyNames(objectKeys) {
  let originalKeys;
  if (Array.isArray(objectKeys)) {
    if ((typeof objectKeys[0]) === 'string') {
      originalKeys = objectKeys;
    } else {
      originalKeys = ObjectUtils.keys(objectKeys);
    }
  } else {
    originalKeys = Object.keys(objectKeys);
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

const renameObjectProperties = function renameObjectProperties(object = {}, originalKeys, targetKeys) {
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
module.exports.selectObjectProperties = function selectObjectProperties(list, propertyNames) {
  if (!list) return [];
  const targetList = Array.isArray(list) ? list : [list];
  return targetList.map(
    (record) => (propertyNames || []).reduce(
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
 * @param {FetchObjectOptions} options -
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
 * @param {FetchObjectOptions} options -
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
