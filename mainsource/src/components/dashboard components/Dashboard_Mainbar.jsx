import React from "react";
import sample from "../../assets/sample.jpg";
import time_tracker from "../../assets/time_tracker.svg";
import { IoMdPlayCircle } from "react-icons/io";
import { MdPauseCircle } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Dashboard_Mainbar = () => {
  const [addWorkReportModalOpen, setAddWorkReportModalOpen] = useState(false);
  const [todayContractAttendanceMissing, setTodayContractAttendanceMissing] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

   const [continuousAbsentees, setContinuousAbsentees] = useState([]);
  const openWorkReportModal = () => {
    setAddWorkReportModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const absenteesColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
      
    },
    {
      field: "name",
      header: "Name",
     
      
    },
    {
      field: "company",
      header: "Company",
      
    },
    {
      field: "consecutiveDays",
      header: "Days",
      body: (rowData) => (
        <span className=" px-3 py-1 rounded-full text-xs">
          {rowData.consecutiveDays}
        </span>
      ),
     
     
    },
    {
      field: "lastPresentDate",
      header: "Last Present",
      
    }
  ];

     // 3. Today's Missing Attendance Columns
  const missingAttendanceColumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_, { rowIndex }) => rowIndex + 1,
     
    },
    {
      field: "name",
      header: "Name",
     
    },
    {
      field: "company",
      header: "Company",
     
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span 
        // className={`px-3 py-1 rounded-full text-xs font-medium ${
        //   rowData.status === 'Added' 
        //     ? 'bg-green-100 text-green-700' 
        //     : 'bg-red-100 text-red-700'
        // }`}
         >
          {rowData.status}
        </span>
      ),
      
    }
  ];

     const loadData = () => {
   // Continuous Absentees
    const mockAbsentees = [
      { company: "Company1", name: "Raj Patel", consecutiveDays: 1, lastPresentDate: "25-12-2025" },
      { company: "Company2", name: "Emma Lee", consecutiveDays: 3, lastPresentDate: "27-12-2025" }
    ];
     // Today Contract Attendance Missing
    const mockMissingAttendance = [
      { company: "Company1", name: "Raj Patel", status: "Added" },
      { company: "Company2", name: "Emma Lee", status: "No Added" }
    ];

    setContinuousAbsentees(mockAbsentees);
    setTodayContractAttendanceMissing(mockMissingAttendance);
  };
  useEffect(() => {
    
    loadData(); 
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
  }, []);
  const [selectedDate, setSelectedDate] = useState("");
  

  const closeWorkReportModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddWorkReportModalOpen(false), 250);
  };

  const [workReportForm, setWorkReportForm] = useState({
    projectTitle: "",
    startWork: "",
    endWork: "",
    responsibilities: [],
  });

  const [responsibilityInput, setResponsibilityInput] = useState("");

  const handleDeleteResponsibility = (index) => {
    setWorkReportForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleAddResponsibility = (e) => {
    if (e.key === "Enter" && responsibilityInput.trim() !== "") {
      setWorkReportForm((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput],
      }));
      setResponsibilityInput("");
    }
  };

  useEffect(() => {
    if (addWorkReportModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [addWorkReportModalOpen]);

  return (
    <div className="h-full w-screen flex flex-col justify-between min-h-screen bg-gray-100 ">
    
      <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-16 md:py-10">
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center">
           <p className="text-xs md:text-sm   text-[#1ea600]">Dashboard</p>
          <p>{">"}</p>
        </div>
 {/* dashboard  */}
            <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 md:gap-6 mt-4 md:mt-8 dashboard-tables">
              
              
                {/* Continuous Absentees */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover ">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#4A4A4A]">
                      Continuous Absentees
                    </h2>
                    {/* <span className="text-sm text-gray-500">
                      {continuousAbsentees.length} employees
                    </span> */}
                  </div>
                  
                 <DataTable
                  value={continuousAbsentees}
              
                  showGridlines
                  responsiveLayout="scroll"
                  className="dashboard-table"
                  emptyMessage="No absentees found."
                >
                  {absenteesColumns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      
                    />
                  ))}
                </DataTable>
              </div>
                
                
                   {/* Today Contract Attendance Missing */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 bg-[url('././assets/zigzaglines_large.svg')] bg-cover">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Today's Missing Attendance
                    </h2>
                    {/* <span className="text-sm ">
                      Contract Employees
                    </span> */}
                  </div>
                  
             <DataTable
                  value={todayContractAttendanceMissing}
                  
                  showGridlines
                  responsiveLayout="scroll"
                  className="dashboard-table"
                  emptyMessage="No missing attendance."
                >
                  {missingAttendanceColumns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      
                    />
                  ))}
                </DataTable>
                </div>
            </div>
    
      </div>

      <Footer/>
    </div>
  );
};

export default Dashboard_Mainbar;
