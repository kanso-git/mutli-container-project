import { Request, Response } from 'express'
import { controller, post, get } from './decorators'
import { AppLogger } from '../AppLogger'
import { getClient } from '../PgClient'
import { RedisClient } from '../RedisClient'
import { QueryResult } from 'pg'

const logger = AppLogger.getInstance()

const redis = RedisClient.getInstance()
const pub = redis.duplicate()

@controller('/api')
class ServerController {
    @get('/ok')
    hi(req: Request, res: Response) {
        logger.log('GET:/api/ok')
        res.json({ status: 'ok' })
    }

    @get('/values/all')
    async getAllValues(req: Request, res: Response): Promise<any> {
        logger.log('GET:/api/values/all')
        try {
            const client = getClient()
            client.connect()
            client.query(
                'select * from values',
                (err: Error, resp: QueryResult<any>) => {
                    logger.log(' First ')
                    if (err) {
                        logger.error(err.message)
                    } else {
                        logger.log(`resp :${resp}`)
                        client.end()
                        res.json(resp.rows)
                    }
                }
            )
        } catch (e) {
            logger.error(`Error in GET:/api/values/all error:${e.message} `)
        }
    }

    @get('/values/current')
    async getCurrentValues(req: Request, res: Response): Promise<any> {
        logger.log('GET:/api/values/current')
        try {
            redis.hgetall('values', (err, values) => {
                res.json(values)
            })
        } catch (e) {
            logger.error(`Error in GET:/api/values/current error:${e.message} `)
        }
    }

    @post('/values')
    async postValue(req: Request, res: Response): Promise<any> {
        logger.log('POST:/api/values')
        try {
            const index = req.body.index

            if (parseInt(index) > 40) {
                return res.status(422).send('Index too high')
            }
            redis.hset('values', index, 'Nothing yet!')
            pub.publish('insert', index)

            const client = getClient()
            client.connect()
            client.query(
                'INSERT INTO values(number) VALUES($1)',
                [index],
                (err: Error, resp: any) => {
                    if (err) {
                        logger.error(err.message)
                    } else {
                        client.end()
                        res.send({ working: true })
                    }
                }
            )
        } catch (e) {
            logger.error(`Error in POST:/api/values error:${e.message} `)
        }
    }
}
