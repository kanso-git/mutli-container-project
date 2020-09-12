import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { AppRouter } from './AppRouter'

import './controllers/ServerController'

import { AppLogger } from './AppLogger'
import { initializeDB } from './PgClient'

const logger = AppLogger.getInstance()

const app = express()

/**
 * Cross Origin Resource sharing
 * it's essentially going to allow us to make requests from one domain that is the react app to different
 * domain or port, In this case that Express API is hosted on
 */
app.use(cors())

/**
 * bodyParser is going to parse incoming requests from the react application and turned the body of the post request into
 * some json so it's easy to work with
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(AppRouter.getInstance())
const initPostgresDb = async () => {
    logger.info('Start initPostgresDb ')
    const r = await initializeDB()
    logger.log(r)
    logger.info('End initPostgresDb ')
}
initPostgresDb()
const PORT = 5000
app.listen(PORT, () => {
    logger.info('server is up and runing on port ' + PORT)
})
