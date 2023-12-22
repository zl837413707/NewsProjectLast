import React, { useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('http://localhost:8100/posts')
      console.log(response.data)
    }
    getData()
  }, [])
  return (
    <div>Home</div>
  )
}
