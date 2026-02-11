
import Attendance_Mainbar from "../components/contract_Attendancecomponents/Attendance_Mainbar";
import AssignedLead_Details from "../components/Lead Management/AssignedLead_Details";
import Sidebar from "../components/Sidebar";


const AssignedLead_Main = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <AssignedLead_Details />
    </div>
  );
};

export default AssignedLead_Main;
