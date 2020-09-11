import redis from 'redis'
import { AppLogger } from './AppLogger'
import * as keys from './keys'

const logger = AppLogger.getInstance()

export class RedisClient {
    private static instance: redis.RedisClient

    static getInstance(): redis.RedisClient {
        if (!RedisClient.instance) {
            logger.log(`keys.redisHost:${keys.redisHost}`)
            logger.log(`keys.redisPort:${keys.redisPort}`)
            /**
             * Redis client setup
             */
            const redisClient = redis.createClient({
                host: keys.redisHost,
                port: (keys.redisPort as unknown) as number,
                retry_strategy: () => 1000, //if we ever lose connection retry in one sec
            })

            RedisClient.instance = redisClient

            // we are making these duplicate connections in both files because according to docs
            // if we ever have a client that's listening or publishing information on redis we have to make a duplicate
            // connection because when a connection is turned into a connection that's going to listen or subscribe or publish
            // information it cannot be used for other purposes
            // RedisClient.redisPublisher = redisClient.duplicate()
        }

        return RedisClient.instance
    }
}
