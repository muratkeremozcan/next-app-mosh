'use client'
import {useEffect, useState} from 'react'

const simulateHeavyProcess = () => {
  // Simulate a large script/dependency (just for testing - this is not actual data)
  const largeData = []
  for (let i = 0; i < 1000000; i++) {
    largeData.push({index: i, value: `Item ${i}`})
  }

  // Simulate some processing delay
  const start = Date.now()
  while (Date.now() - start < 3000) {
    // This empty loop simulates a heavy processing delay of 3 seconds
  }

  return largeData.length // for this example, we're not using this data
}

const HeavyComponent = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate a heavy load or a delay in getting the component ready
    setTimeout(() => {
      simulateHeavyProcess()
      setLoading(false)
    }, 0) // Execute after any remaining event loop tasks
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <div>My Heavy Component</div>
}

export default HeavyComponent
