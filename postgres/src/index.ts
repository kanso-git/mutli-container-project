import { Client, QueryResult } from 'pg'
import * as keys from './keys'
import { AppLogger } from './AppLogger'

const logger = AppLogger.getInstance()
//const connectionString =
//  'postgressql://postgres:postgres_password@192.168.99.100:5432/postgres'

const connectionString = `postgressql://${keys.pgUser}:${keys.pgPassword}@${keys.pgHost}:${keys.pgPort}/${keys.pgDatabase}`

const initializeDB = new Promise<string>((resolve, reject) => {
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
                resolve('initializeDB Done')
                client.end()
            }
        }
    )
})

const getValues = new Promise<QueryResult<any>>((resolve, reject) => {
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    client.query(
        'select * from values',
        (err: Error, resp: QueryResult<any>) => {
            logger.log(' First ')
            if (err) {
                logger.error(err.message)
            } else {
                resolve(resp)
                client.end()
            }
        }
    )
})

const callThem = async () => {
    await initializeDB
    const res = await getValues
    logger.log(res.rows)
}

callThem()
