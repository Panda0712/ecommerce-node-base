const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.subscriber.connect();
        await this.publisher.connect();
        this.isConnected = true;
        console.log("Redis clients connected successfully");
      } catch (error) {
        console.error("Redis connection error:", error);
        throw error;
      }
    }
  }

  async publish(channel, message) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const result = await this.publisher.publish(channel, message);
      return result;
    } catch (error) {
      console.error("Redis publish error:", error);
      throw error;
    }
  }

  async subscribe(channel, callback) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.subscriber.subscribe(channel, (message, subscribedChannel) => {
        callback(subscribedChannel, message);
      });
    } catch (error) {
      console.error("Redis subscribe error:", error);
      throw error;
    }
  }
}

module.exports = new RedisPubSubService();
