import { Client, QueryResult } from 'pg'
import { AppLogger } from './AppLogger'
import * as keys from './keys'

const logger = AppLogger.getInstance()
const connectionString = `postgressql://${keys.pgUser}:${keys.pgPassword}@${keys.pgHost}:${keys.pgPort}/${keys.pgDatabase}`

const getClient = (): Client => {
    logger.info(`connectionString:${connectionString} `)
    return new Client({
        connectionString: connectionString,
    })
}

const initializeDB = () =>
    new Promise<string>((resolve, reject) => {
        const client = new Client({
            connectionString: connectionString,
        })
        client.connect()
        client.query(
            'CREATE TABLE IF NOT EXISTS values (number INT)',
            (err: Error, resp: QueryResult<any>) => {
                logger.log(' Initialize DB ')
                if (err) {
                    logger.error(err.message)
                } else {
                    resolve('DB initialization done successulfy')
                    client.end()
                }
            }
        )
    })

export { getClient, initializeDB }
