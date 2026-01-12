import EmployeeDetails_Mainbar from "../components/EmployeeComponents/EmployeeDetails_Mainbar";
import Sidebar from "../components/Sidebar";



const Employee_Main = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <EmployeeDetails_Mainbar/>
    </div>
  );
};

export default Employee_Main;
