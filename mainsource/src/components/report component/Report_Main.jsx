import Sidebar from "../Sidebar"
import Report_Detail from "./Report_Detail"


const Report_Main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>
      
     <Report_Detail />
    </div>
  )
}

export default Report_Main