import Pss_Attendance_Mainbar from "../components/pss_attendanceComponents/Pss_Attendance_Mainbar";
import Sidebar from "../components/Sidebar";




const PSS_Attendance = () => {
  return (
    <div className="flex">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Pss_Attendance_Mainbar />
    </div>
  );
};

export default PSS_Attendance;
