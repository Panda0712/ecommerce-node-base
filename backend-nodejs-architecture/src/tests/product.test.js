const RedisPubSubService = require("../services/redisPubsub.service");

class ProductTestService {
  async purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    console.log("productId", productId);

    try {
      await RedisPubSubService.publish("purchase_event", JSON.stringify(order));
      console.log("Purchase event published successfully");
    } catch (error) {
      console.error("Error publishing purchase event:", error);
    }
  }
}

module.exports = new ProductTestService();
