const { getClient, initElastic } = require("../../db/init.elasticsearch");
initElastic({
  ELASTICSEARCH_IS_ENABLED: true,
});

const esClient = getClient().elasticClient;

// search document
const searchDocument = async (idxName, docType, payload) => {
  const result = await esClient.search({
    index: idxName,
    type: docType,
    body: payload,
  });

  console.log("search::", result?.body?.hits?.hits);
};

// add documentation
const addDocument = async ({ idxName, _id, docType, payload }) => {
  try {
    const newDoc = await esClient.index({
      index: idxName,
      type: docType,
      id: _id,
      body: payload,
    });

    console.log("add new::", newDoc);
  } catch (error) {}
};

// test run
// test run
// addDocument({
//   idxName: "product_v001",
//   _id: "1113333",
//   docType: "product",
//   payload: {
//     title: "Iphone 1113333",
//     price: 1113333,
//     images: "...",
//     category: "mobile",
//   },
// }).then((rs) => console.log(rs));

searchDocument("product_v001", "product").then();

module.exports = {
  searchDocument,
  addDocument,
};
