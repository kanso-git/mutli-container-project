import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AppLogger } from './AppLogger'

const logger = AppLogger.getInstance()
const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState<Record<string, string>[]>([])
  const [values, setValues] = useState<Record<string, string>[]>([])
  const [index, setIndex] = useState('')

  const renderValues = () => {
    const entries = []
    logger.log(values)
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated: {values[key]}
        </div>,
      )
    }
    return entries
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      logger.info(`handleSubmit index :${index} `)
      await axios.post('/api/values', {
        index,
      })
      setIndex('')
    } catch (e) {
      logger.error(`handleSubmit error:${e.message} `)
    }
  }

  useEffect(() => {
    if (!index) {
      const fetchValues = async () => {
        try {
          const values = await axios.get('/api/values/current')
          logger.info(`fetchValues: ${JSON.stringify(values, null, 3)} `)
          setValues(values.data)
        } catch (e) {
          logger.error(`fetchValues error:${e.message} `)
        }
      }
      const fetchIndexes = async () => {
        try {
          const seenIndexes = await axios.get('/api/values/all')
          logger.info(`fetchIndexes: ${JSON.stringify(seenIndexes, null, 3)} `)
          setSeenIndexes(seenIndexes.data)
        } catch (e) {
          logger.error(`fetchIndexes error:${e.message} `)
        }
      }
      fetchValues()
      fetchIndexes()
    }
  }, [index])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="entry">Enter your index:</label>
        <input
          type="text"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button type="submit">Submit</button>

        <h3>Indexes i have seen</h3>
        {seenIndexes && seenIndexes.map(({ number }) => number).join(', ')}

        <h3>Calculated values</h3>
        {renderValues()}
      </form>
    </div>
  )
}

export default Fib
