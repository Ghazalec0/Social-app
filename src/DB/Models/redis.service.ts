import { redisClient } from "./redis.connect";

export async function setIntoCache(
  key: string,
  value: string | number,
  expire: number
) {
  redisClient.set(key, value, { EX: expire });
}

export async function getFromCache(key: string) {
 return redisClient.get(key);
}

export async function deleteFromCache(key: string) {
  return redisClient.del(key);
}