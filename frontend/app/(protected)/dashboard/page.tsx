import { getAuthToken } from '@/lib/auth'
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}


async function getdata() {
  const response = getAuthToken();

  try {
    if (!response) {
      const data = fetch()
    await Response({})
    }
  } catch (error) {
    
  }
}

export default page