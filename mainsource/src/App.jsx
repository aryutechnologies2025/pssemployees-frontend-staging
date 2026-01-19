import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Contract_Attendance";
import Message from "./pages/Message";
import Login from "./pages/Login";
// import Leaves from "./pages/Leaves";
import PageNotFound from "./pages/PageNotFound";
import ContractCandidates from "./pages/ContractCandidates";
import Attendance_Add_main from "./components/contract_Attendancecomponents/Attendance_Add_Main";
import Attendance_Edit_Main from "./components/contract_Attendancecomponents/Attendance_Edit_Main";
// import Attendance_View_Details from "./components/contract_Attendancecomponents/Attendance_View_Details";
import Attendance_view_Main from "./components/contract_Attendancecomponents/Attendance_View_Main";
import PSS_Attendance from "./pages/PSS_Attendance";
import AuthLayout from "./layouts/AuthLayout";
import Employee_contract_main from "./pages/Employee_contract_main";
import Employee_Main from "./pages/Employee_Main";
import LeadManagement from "./pages/LeadManagement";
import DailyWork_Report from "./components/Daily Work Report/DailyWork_Report";
import Finance from "./pages/Finance";

function App() {

  const Psspermission = JSON.parse(localStorage.getItem("psspermission") || "{}");
  // const permissionmodula = Psspermission.modules



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contractattendance" element={<Attendance />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/attendance-add" element={<Attendance_Add_main />} />
          <Route
            path="/attendance-edit/:id"
            element={<Attendance_Edit_Main />}
          />
          <Route path="/pssattendance" element={<PSS_Attendance />} />
          <Route
            path="/contractattendance-add"
            element={<Attendance_Add_main />}
          />
          <Route
            path="/contractattendance-edit/:id"
            element={<Attendance_Edit_Main />}
          />
          <Route
            path="/employeecontract"
            element={<Employee_contract_main />}
          />
          <Route
            path="/employeedetails/:id"
            element={<Employee_Main />}
          />
          <Route
            path="/contractattendance-view/:id"
            element={<Attendance_view_Main />}
          />
          <Route path="/contractcandidates" element={<ContractCandidates />} />
          <Route path="/message" element={<Message />} />
          <Route path="/dailywork_report" element={<DailyWork_Report />} />
          <Route path="lead-engine" element={<LeadManagement />} />

        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
