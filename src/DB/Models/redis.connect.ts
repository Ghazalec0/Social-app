import { createClient } from "redis";
import { REDIS_URL } from "../../config";

export const redisClient = createClient({
  url: REDIS_URL
});


redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function redisConnect() {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (err) {
    console.log("Fail to connect to Redis:", err);
  }
}