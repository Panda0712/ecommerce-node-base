"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ['a','b'] => {a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnselectedData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (!obj[k]) {
      delete obj[k];
    }
  });

  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};

  Object.keys(obj || {}).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response || {}).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else final[k] = obj[k];
  });

  return final;
};

// {{lastname}} or {{verifykey}}
const replacePlaceholder = (template, params) => {
  Object.keys(params).forEach((k) => {
    const placeholder = `{{${k}}}`; // e.g., {{verifykey}}
    template = template.replace(new RegExp(placeholder, "g"), params[k]);
  });

  return template;
};

const randomProductId = (_) => {
  return Math.floor(Math.random() * 899999 + 100000);
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectedData,
  removeUndefinedObject,
  updateNestedObjectParser,
  replacePlaceholder,
  randomProductId,
};
