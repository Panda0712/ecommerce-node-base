"use strict";

const Template = require("../models/template.model");
const { htmlTemplateToken } = require("../utils/tem.html");

const newTemplate = async ({ tem_name, tem_html, tem_id = 0 }) => {
  // 1. check if template exists
  // 2. create a new template
  const newTemplate = await Template.create({
    tem_id,
    tem_name,
    tem_html: htmlTemplateToken(),
  });

  return newTemplate;
};

const getTemplate = async ({ tem_name }) => {
  const template = await Template.findOne({
    tem_name,
  });

  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
