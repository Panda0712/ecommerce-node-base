"use strict";

const { Client } = require("@elastic/elasticsearch");

let clients = {};

const instanceEventListeners = async (elasticSearch) => {
  try {
    await elasticSearch.ping();
    console.log("Connected to elasticsearch successfully!!!");
  } catch (error) {
    console.error("Error connecting to elastic search!!!", error);
  }
};

const initElastic = async ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOST = "http://localhost:9200",
}) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    const elasticClient = new Client({
      node: ELASTICSEARCH_HOST,
    });
    clients.elasticClient = elasticClient;
    await instanceEventListeners(elasticClient);
  }
};

const getClient = () => clients;

const closeConnection = async () => {
  //   try {
  //     if (client.instanceConnect) {
  //       await client.instanceConnect.disconnect();
  //       console.log("Redis connection closed");
  //     }
  //   } catch (error) {
  //     console.error("Error closing Redis connection:", error);
  //   }
};

module.exports = {
  initElastic,
  getClient,
  closeConnection,
};
