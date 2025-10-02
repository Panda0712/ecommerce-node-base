const RedisPubSubService = require("../services/redisPubsub.service");

class InventoryTestService {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await RedisPubSubService.subscribe(
        "purchase_event",
        (channel, message) => {
          try {
            const orderData = JSON.parse(message);
            InventoryTestService.updateInventory(orderData);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        }
      );
      console.log("Inventory service subscribed to purchase_event");
    } catch (error) {
      console.error("Error initializing inventory service:", error);
    }
  }

  static updateInventory({ productId, quantity }) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = InventoryTestService;
