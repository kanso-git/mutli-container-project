import redis from 'redis'
import { AppLogger } from './AppLogger'

import * as keys from './keys'

const logger = AppLogger.getInstance()

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: (keys.redisPort as unknown) as number,
    retry_strategy: () => 1000,
})

// we are making these duplicate connections in both files because according to docs
// if we ever have a client that's listening or publishing information on redis we have to make a duplicate
// connection because when a connection is turned into a connection that's going to listen or subscribe or publish
// information it cannot be used for other purposes
const sub = redisClient.duplicate()

/**
 *
 * @param index
 */
const fib = (index: number): number => {
    const val = index < 2 ? 1 : fib(index - 1) + fib(index - 2)
    logger.info(`Recieved index:${index}, fib(${index})=${val}`)
    return val
}

sub.on('message', (channel: any, message: any) => {
    logger.info(`on message channel:${channel}, message=${message}`)
    redisClient.hset('values', message, `${fib(parseInt(message))}`)
})

sub.subscribe('insert')
