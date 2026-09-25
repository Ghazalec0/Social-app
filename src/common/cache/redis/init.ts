import {RedisCacheProvider} from "./redis.service";
import {REDIS_URL} from "../../../config";

export const redisCacheProvider = new RedisCacheProvider({
    url: REDIS_URL
})