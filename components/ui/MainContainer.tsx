
import React, { ReactNode } from 'react'

interface containerProps {
  children: ReactNode, className: string
}

function MainContainer({ children, className }:containerProps) {
  return (
    <div className=' z-10'>
      <div className={`max-w-[1366px] mx-auto ${className}`}>
        <div className='px-5'>
        {children}
        </div>
      </div>
    </div>
  )
}

export default MainContainer