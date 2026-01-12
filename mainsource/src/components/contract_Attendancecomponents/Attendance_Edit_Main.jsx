import Sidebar from "../Sidebar";
import Attendance_Edit_Details from "./Attendance_Edit_Details";

const Attendance_Edit_Main = () => {
  return (
    <div className="flex ">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Attendance_Edit_Details />
    </div>
  );
};

export default Attendance_Edit_Main;
