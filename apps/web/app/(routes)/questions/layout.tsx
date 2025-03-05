import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex justify-center w-full'>
      {children}
    </div>
  )
}
