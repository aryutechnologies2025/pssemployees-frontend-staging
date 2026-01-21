import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import medics_logo from "../assets/medics_logo.svg";
import admin_icon from "../assets/admin_icon.png";
import employee from "../assets/employee.svg";
import company from "../assets/company.svg";
import contact from "../assets/contact.svg";
import contractcandidates from "../assets/contract_Candidates.svg";
import jobform from "../assets/job-form.svg";
import attendance from "../assets/attendance.svg";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MdOutlineContactMail } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { LuCalendar } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaChevronDown, FaBuilding, FaUser } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { TbContract } from "react-icons/tb";
import { CiCalendar } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { Capitalise } from "../utils/useCapitalise";
import { API_URL } from "../config";


const Sidebar = () => {

  

  const user = JSON.parse(localStorage.getItem("pssemployee") || "{}");
  console.log("USER : ",user)
  const Psspermission = JSON.parse(localStorage.getItem("psspermission") || "{}");
  // const permissionmodula = Psspermission.modules
  // console.log("Psspermission", permissionmodula);
  const id = user?.id;
  const image=user?.photo ? `${API_URL}/${user.photo}`
  : admin_icon;
  console.log("EMPLOYEE IMAGE : ",`${API_URL}/${user.photo}`);
  const name=user?.full_name;
  // console.log("EMPLOYEE name : ",name);
  const role = user?.role_id;


  // console.log("companyID", id);

  const [arrowClicked, setArrowClicked] = useState(() => {
    // Get the persisted state from localStorage
    const savedState = localStorage.getItem("sidebarState");
    return savedState === "true";
  });

  const [currentOpen, setCurrentOpen] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  let navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;


  const hasPermission = (moduleName) => {
    return (Psspermission?.modules || []).some(
      (item) => item.module === moduleName
    );
  };



  // Path matchers for active states
  const isAttendanceActive = location.pathname.startsWith("/contractattendance");
  const isContractEmployeeActive = location.pathname.startsWith("/contractemployee");
  const isPssAttendanceActive = location.pathname.startsWith("/pssattendance");
  const isContractCandidatesActive = location.pathname.startsWith("/employeecontract");

  const isPssActive = isPssAttendanceActive;
  const isContractActive =
    isContractCandidatesActive || isAttendanceActive;

  const isInterviewCandidatesActive =
    location.pathname.startsWith("/contractcandidates");

  useEffect(() => {
    if (isInterviewCandidatesActive) {
      setCurrentOpen("interview");
    } else if (isAttendanceActive) {
      setCurrentOpen("contract");
    } else if (isPssAttendanceActive) {
      setCurrentOpen("pss");
    } else {
      setCurrentOpen(null);
    }
  }, [location.pathname]);


  const toggleMenu = (menu) => {
    setCurrentOpen(currentOpen === menu ? null : menu);
  };

  const onClickArrow = () => {
    const newState = !arrowClicked;
    setArrowClicked(newState);
    localStorage.setItem("sidebarState", newState);
  };

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      setButtonLoading(true);
      setTimeout(() => {
        localStorage.removeItem("pssuser");
        window.location.reload();
        window.scrollTo({ top: 0, behavior: "instant" });
        setButtonLoading(false);
      }, 300);
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };



  return (
    <div>
      <section
        className={`bg-white max-md:hidden max-h-dvh transition-all duration-500 flex flex-col ${arrowClicked ? "w-[60px]" : "w-52 "
          }`}
      >
        <ToastContainer />
        <div
          className={`fixed flex flex-col h-full  ${arrowClicked ? "w-[50px]" : "w-48"
            }`}
        >
          {/* Toggle Button */}
          <div
            className="flex justify-end mt-3 items-center"
            onClick={onClickArrow}
            title="Toggle Sidebar"
          >
            <div
              className={`${arrowClicked ? "-me-3" : "-me-8"
                } w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer`}
            >
              {arrowClicked ? (
                <IoIosArrowForward className="w-3 h-3" />
              ) : (
                <IoIosArrowBack className="w-3 h-3" />
              )}
            </div>
          </div>

          {/* Logo */}
          {arrowClicked ? (
            <div className="h-6 my-3 ms-2 text-xl font-semibold">
              <p className="text-[#4BB452]">
                <img
                  src="/pss-favicon.jpeg"
                  alt="PSS Logo"
                  className="h-7 w-7 cursor-pointer rounded-full"
                  onClick={() => navigate("/")}
                />
              </p>
            </div>
          ) : (
            <img
              src="/pssAgenciesLogo.svg"
              alt="PSS Logo"
              className="w-40 md:w-48 h-auto mx-auto mb-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          {/* Sidebar Menu */}
          <div
            className={`scroll-container flex-grow w-full pb-24 flex flex-col justify-start`}
            style={{ scrollbarGutter: "stable" }}
          >
            <div
              className={`flex gap-1 mt-2 mx-2 flex-col ${arrowClicked ? "items-center" : "items-start"
                }`}
            >

              {/* dashboard */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-[7px]"}`}>
                <div
                  onClick={() => onClickSidebarMenu("Dashboard")}
                  className={`flex items-center h-10 w-full flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                    } hover:bg-green-100 hover:text-[#4BB452] px-2 py-3 rounded-md gap-2 text-gray-500 text-sm font-medium cursor-pointer ${currentPath === "/dashboard"
                      ? "bg-[#4BB452] text-white"
                      : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  <CiBoxList className="w-5" />
                  {!arrowClicked && <p className="text-sm">Dashboard</p>}
                </div>
              </div>

              {/* PSS Menu */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => toggleMenu("pss")}
                  className={`flex items-center w-full flex-grow
${arrowClicked ? "justify-center" : "justify-normal"}
px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
${currentPath === "/pssattendance"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}

                >
                  <FaBuilding className="w-5" />

                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">PSS</span>
                      {currentOpen === "pss" || isPssAttendanceActive ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {/* PSS Submenu */}
                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "pss" || isPssAttendanceActive
                      ? "max-h-50 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="flex gap-2 items-start ms-8 flex-col text-sm font-medium text-gray-500">
                      <button
                        onClick={() => {
                          navigate("/pssattendance");
                          if (currentOpen !== "pss") {
                            setCurrentOpen("pss");
                          }
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
                          ${isPssAttendanceActive
                            ? "text-[#4BB452]"
                            : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                          }`}
                      >
                        Attendance
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Menu */}

              {hasPermission("candidate") && (
                <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                  <div
                    onClick={() => toggleMenu("interview")}
                    className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${isInterviewCandidatesActive
                        ? "bg-[#4BB452] text-white"
                        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                      }`}
                  >
                    <FaUser className="w-5" />

                    {!arrowClicked && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">Interview</span>
                        {currentOpen === "interview" || isInterviewCandidatesActive ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Interview Submenu */}
                  {!arrowClicked && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "interview" || isInterviewCandidatesActive
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="flex gap-2 items-start ms-8 flex-col text-sm font-medium">
                        <button
                          onClick={() => {
                            navigate("/contractcandidates");
                            setCurrentOpen("interview");
                          }}
                          className={`w-full text-left px-2 py-1 rounded-md transition
            ${isInterviewCandidatesActive
                              ? "text-[#4BB452]"
                              : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                            }`}
                        >
                          Candidates
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}


              {/* Contract Menu */}
              {(hasPermission("employee") || hasPermission("attendance")) && (
                <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                  <div
                    onClick={() => toggleMenu("contract")}
                    className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${isAttendanceActive || isContractCandidatesActive
                        ? "bg-[#4BB452] text-white"
                        : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                      }`}
                  >
                    <TbContract className="w-5" />

                    {!arrowClicked && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">Contract</span>
                        {currentOpen === "contract" ||
                          isAttendanceActive ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contract Submenu */}
                  {!arrowClicked && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "contract" ||
                        currentPath === "/employeecontract" ||
                        isAttendanceActive
                        ? "max-h-50 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="flex gap-2 items-start ms-8 flex-col text-sm font-medium text-gray-500">

                        {hasPermission("employee") && (
                          <button
                            onClick={() => {
                              navigate("/employeecontract");
                              setCurrentOpen("contract");
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md transition
             ${isContractCandidatesActive
                                ? "text-[#4BB452]"
                                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                              }`}
                          >
                            Employee
                          </button>
                        )}
                        {hasPermission("attendance") && (
                          <button
                            onClick={() => {
                              navigate("/contractattendance");
                              if (currentOpen !== "contract") {
                                setCurrentOpen("contract");
                              }
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md transition
                          ${isAttendanceActive
                                ? "text-[#4BB452]"
                                : "text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                              }`}
                          >
                            Attendance
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* lead management */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("lead-engine")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/lead-engine"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  <MdLeaderboard className="w-5 " />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Lead Engine</p>
                  )}
                </div>
              </div>

              {/* daily work report */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("dailywork_report")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/dailywork_report"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  <TbReport  className="w-5 " />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Daily Work Report</p>
                  )}
                </div>
              </div>

              {/* finance */}

                <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>
                <div
                  onClick={() => onClickSidebarMenu("finance")}
                  className={`flex items-center w-full flex-grow
    ${arrowClicked ? "justify-center" : "justify-normal"}
    px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
    ${currentPath === "/finance"
                      ? "bg-[#4BB452] text-white"
                      : "group text-gray-500 hover:bg-green-100 hover:text-[#4BB452]"
                    }`}
                >
                  <GrMoney  className="w-5 " />

                  {!arrowClicked && (
                    <p className="text-sm font-medium">Finace</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* User Section */}
          <div className="p-1">
            {/* Logout Button */}
            <div className="w-full px-2">
              <div
                onClick={() => onClickSidebarMenu("/")}
                className={`group flex items-center w-full ${arrowClicked ? "justify-center" : "justify-normal"
                  } px-3 py-3 rounded-full gap-3 items-center mt-1 h-10 text-center my-2 border border-black  hover:bg-[#E0E0E0] hover:border-[#E0E0E0] transition-all duration-200  cursor-pointer`}
              >
                <div className="text-[#0D0D0D] flex items-center justify-center">
                  <MdLogout />
                </div>
                {!arrowClicked && (
                  <p className="text-sm font-medium text-center text-[#0D0D0D]">
                    Logout
                  </p>
                )}
              </div>
            </div>
            <hr className="border-gray-300" />
            <div
              className="flex items-center gap-3 px-2 py-4 cursor-pointer"
              onClick={() => navigate(`/employeedetails/${id}`)}
            >
              {/* <img src={admin_icon} alt="" className="h-8 w-8 rounded-full" /> */}
              <img src={image} alt="" className="h-8 w-8 rounded-full" />
              {!arrowClicked && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-500">
                      Welcome back
                    </p>
                  </div>
                  {/* <p className="font-medium text-sm">PSS Employee</p> */}
                  <p className="font-medium text-sm">{Capitalise(name)}</p>
                </div>
              )}
              {!arrowClicked && (
                <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
