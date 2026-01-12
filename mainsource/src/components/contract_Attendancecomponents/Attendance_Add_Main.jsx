import React from 'react'
import Sidebar from '../Sidebar'
import Attendance_Add_Details from './Attendance_Add_Details'




const Attendance_Add_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Attendance_Add_Details/>
    </div>
  )
}

export default Attendance_Add_main