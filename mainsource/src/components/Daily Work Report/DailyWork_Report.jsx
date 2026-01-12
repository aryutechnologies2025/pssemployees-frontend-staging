import React from 'react'
import Sidebar from '../Sidebar'
import DailyWork_Report_Main from './DailyWork_Report_Main'

const DailyWork_Report = () => {
  return (
    <div className='flex'>
     <div>
          <Sidebar />
     </div>
      <DailyWork_Report_Main />
    </div>
  )
}

export default DailyWork_Report
