import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";

import axiosInstance from "../../Utils/axiosConfig.jsx";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "primereact/multiselect";
import { useRef } from "react";
import customise from "../../assets/customise.svg";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
import { Capitalise } from "../../Utils/useCapitalise.jsx";
import { formatToDDMMYYYY, formatToYYYYMMDD } from "../../Utils/dateformat.js";
import { Editor } from "primereact/editor";
import { file } from "zod";


const Finace_Details = () => {
    let navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    // const [editFinanceForm, setEditFinanceForm] = useState(null);
    const storedDetatis = localStorage.getItem("pssemployee");
    const parsedDetails = JSON.parse(storedDetatis);
    const userid = parsedDetails ? parsedDetails.id : null;
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");;
    
    const today= new Date().toISOString().split("T")[0];
    
    const [financeForm, setFinanceForm] = useState({
        company: "",
        branch: "",
        date: today,
        amount: "",
    description: "",
        status: "Pending",
        file: null,
    });

    const [editFinanceForm, setEditFinanceForm] = useState({
        id: null,
        company: "",
        branch: "",
        date: "",
        amount: "",
    description: "",
        file: null,
        status: ""
    });

    // list
    const fetchFinaceDetails = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get(
                // `${API_URL}api/fiance`
            );
            console.log("list res", res);

            
            setTotalRecords(dummyData.length);

        } catch (err) {
            toast.error("Failed to fetch Finace Details");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFinaceDetails();
    }, []);

    // create
    const handleCreateFinaceDetails = async () => {

       if (
    !financeForm.company ||
    !financeForm.branch ||
    !financeForm.date ||
    !financeForm.amount ||
    !financeForm.description ||
    !finaceForm.file ||
    !financeForm.status
  ) 

        try {
            const payload = {
                
                created_by: userid
            };

            console.log("PAYLOAD SENDING TO API:", payload);

            const res = await axiosInstance.post(
                // `${API_URL}api/finance/create`,
                payload
            );

            console.log("CREATE RESPONSE:", res);

            toast.success("Finace Created Successfully");
            closeAddModal();
            fetchFinaceDetails();

            // reset form
            setFinanceForm({
                company: "",
        brunch: "",
        date: "",
        amount: "",
    description: "",
        file: null,
        status: ""
            });

        } catch (error) {
            console.error("CREATE ERROR:", error.response || error);
            toast.error("Failed To Create Fiance Details");
        }
    };


    // update
    const handleUpdateWorkReport = async () => {

        if (!editDailyForm.report_date || !editDailyForm.report) {
            toast.error("All fields required");
            return;
        }

        try {
            const payload = {
                
                updated_by: userid
            };

            await axiosInstance.put(
                // `${API_URL}api/finance/update/${editDailyForm.id}`,
                payload
            );

            toast.success("Daily work Report updated");
            closeEditModal();
            fetchFinaceDetails();

        } catch (error) {
            console.error(error);
            toast.error("Failed to Update Daily Work Report");
        }
    };


    // open add
    const openAddModal = () => {
        setIsAddModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };
    // close add
    const closeAddModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsAddModalOpen(false);

            setErrors({});
        }, 300);
    };
    // edit
    // const openEditModal = async (row) => {
    //     try {
    //         const res = await axiosInstance.get(
    //             // `${API_URL}api/finance/edit/${row.id}`
    //         );

    //         const data = res.data.data ?? res.data;

    //         setEditFinanceForm({
    //             id: data.id,
    //             company: data.company,
    //     branch: data.branch,
    //     date: data.date,
    //     amount: data.amount,
    // description: data.description,
    //     file: data.file,
    //     status: data.status
    //         });

    //         setIsEditModalOpen(true);
    //         setTimeout(() => setIsAnimating(true), 50);

    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to Finance Details");
    //     }
    // };

    const openEditModal = (row) => {
  setEditFinanceForm({
    id: row.id,
    company: row.company,
    branch: row.branch,
    date: row.date,
    amount: row.amount,
    description: row.description,
    file: null,        // file cannot be prefilled
    status: row.status ?? "Pending",
  });

  setIsEditModalOpen(true);
  setTimeout(() => setIsAnimating(true), 50);
};


    // close edit 
    const closeEditModal = () => {
        setIsAnimating(false);
        setErrors({});
        setTimeout(() => {
            setIsEditModalOpen(false);
            setFinaceForm(null);
        }, 250);
    };


    const openMessageView = (row) => {
        setViewMessage(row);
    };

    // DUMMY DATA FOR TABLE
    const [dummyData, setDummyData] = useState([
        { id: 1, company: "Company A", brunch: "Chennai", date: "2023-10-01", amount: 5000, status: "Approved", report: "Monthly rent" },
        { id: 2, company: "Company B", brunch: "Bangalore", date: "2023-10-05", amount: 1200, status: "Pending", report: "Office supplies" }
    ]);

    // OPTIONS FOR DROPDOWNS
    const companyOptions = [
        { label: "Company A", value: "Company A" },
        { label: "Company B", value: "Company B" }
    ];

    const branchOptions = [
        { label: "Chennai", value: "Chennai" },
        { label: "Bangalore", value: "Bangalore" }
    ];


    const statusOptions = [
        { label: "Pending", value: "Pending" },
        { label: "Waiting for MD Approval", value: "Waiting for MD Approval" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" }
    ];

    const columns = [
        {
            field: "sno",
            header: "S.No",
            body: (_, options) => options.rowIndex + 1,
        },
        {
            field: "company",
            header: "Company_Name",
            body: (row) => Capitalise(row.company || "-"),
            
        },
         {
            field: "branch",
            header: "Branch",
            body: (row) => Capitalise(row.brunch || "-"),
            
        },
        {
            field: "date",
            header: "Date",
            body: (row) => formatToDDMMYYYY(row.date)
        },
        {
  header: "Status",
  field: "status",
  body: (row) => {
    const status = row.status;

    let color =
      status === "Approved"
        ? "text-[#16A34A] bg-green-100"
        : status === "Rejected"
        ? "text-[#DC2626] bg-[#FFF0F0]"
        : status === "Waiting for MD Approval"
        ? "text-[#FD8700] bg-[#FFCB90]"
        : status === "Pending"
        ? "text-blue-600 bg-blue-100"
        : "text-gray-600 bg-gray-100";

    return (
      <div
        className={`border rounded-[50px] px-3 py-1 ${color}`}
        style={{
          display: "inline-block",
          minWidth: "140px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 400,
        }}
      >
        {status || "-"}
      </div>
    );
  },
  style: { textAlign: "center" },
},

        {
            field: "action",
            header: "Action",
            body: (row) => (
                <div className="flex justify-center gap-3">
                    <TfiPencilAlt
                        className="text-[#1ea600] cursor-pointer hover:scale-110 transition"
                        onClick={() => openEditModal(row)}
                    />
                </div>
            ),
            style: { textAlign: "center" }
        }
    ];







    return (
        <div className="flex  flex-col justify-between bg-gray-50  px-3 md:px-5 pt-2 md:pt-10 w-full min-h-screen overflow-x-auto ">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <div className="">
                            <Mobile_Sidebar />
                        </div>

                        <div className="flex justify-start gap-2 mt-2 md:mt-0 items-center">
                            <ToastContainer position="top-right" autoClose={3000} />

                            <p className="text-sm md:text-md text-gray-500  cursor-pointer" onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </p>
                            <p>{">"}</p>
                            <p className="text-sm  md:text-md  text-[#1ea600]">Fiance</p>
                        </div>


                        <div className="flex flex-col w-full mt-1 md:mt-5 h-auto rounded-2xl bg-white 
shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
px-2 py-2 md:px-6 md:py-6">
                            <div className="datatable-container mt-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                    {/* Entries per page */}
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <Dropdown
                                                value={rows}
                                                options={[10, 25, 50, 100].map(v => ({ label: v, value: v }))}
                                                onChange={(e) => setRows(e.value)}
                                                className="w-20 border"
                                            />
                                            <span className=" text-sm text-[#6B7280]">Entries Per Page</span>

                                        </div>

                                    </div>

                                    <div className="flex justify-between items-center gap-5">
                                        {/* Search box */}
                                        <div className="relative w-64">
                                            <FiSearch
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                size={18}
                                            />

                                            <InputText
                                                value={globalFilter}
                                                onChange={(e) => setGlobalFilter(e.target.value)}

                                                placeholder="Search......"
                                                className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#1ea600]"

                                            />
                                        </div>
                                        <div className="flex justify-between items-center gap-5">

                                            <button
                                                onClick={openAddModal}
                                                className="px-2 md:px-3 py-2  text-white bg-[#1ea600] hover:bg-[#4BB452] font-medium  w-fit rounded-lg transition-all duration-200"
                                            >
                                                Add Finance
                                            </button>

                                        </div>

                                    </div>
                                </div>
                                <div className="table-scroll-container" id="datatable">
                                    <DataTable
                                        className="mt-8"
                                        value={dummyData}
                                        onRowClick={(e) => e.originalEvent.stopPropagation()}
                                        paginator
                                        rows={rows}
                                        totalRecords={totalRecords}
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        globalFilter={globalFilter}
                                        showGridlines
                                        resizableColumns
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                        paginatorClassName="custom-paginator"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        loading={loading}
                                    >
                                        {columns.map((col, index) => (
                                            <Column
                                                key={index}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}
                                                style={col.style}
                                            />
                                        ))}
                                    </DataTable>

                                </div>
                            </div>
                        </div>

                        {/* Add Modal */}
                        {isAddModalOpen && (
                            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                                <div className="absolute inset-0" onClick={closeAddModal}></div>

                                <div
                                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
      bg-white shadow-lg transform transition-transform duration-500 ease-in-out
      ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                                >
                                    {/* Close Arrow */}
                                    <div
                                        className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300
        flex items-center justify-center cursor-pointer"
                                        onClick={closeAddModal}
                                    >
                                        <IoIosArrowForward className="w-3 h-3" />
                                    </div>

                                    <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                                        <p className="text-xl md:text-2xl">Add Finance</p>

{/* Company */}
<div className="mt-5 flex justify-between items-center">
  <label className="block text-md font-medium">
    Company <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <Dropdown
  value={financeForm.company}
  options={companyOptions}
  onChange={(e) =>
    setFinanceForm({ ...financeForm, company: e.value })
  }
  placeholder="Select Company"
  className="w-full border border-gray-300 rounded-lg"
/>
  </div>
</div>

{/* Branch */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Branch <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <Dropdown
  value={financeForm.branch}
  options={branchOptions}
  onChange={(e) =>
    setFinanceForm({ ...financeForm, branch: e.value })
  }
  placeholder="Select Branch"
 className="w-full border border-gray-300 rounded-lg"
/>
  </div>
</div>


{/* Date */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Date <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <input
      type="date"
      value={financeForm.date}
      onChange={(e) =>
        setFinanceForm({ ...financeForm, date: e.target.value })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
    />
  </div>
</div>

{/* Amount */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Amount <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <input
    type="number"
    placeholder="Enter Amount"
    value={financeForm.amount}
    onChange={(e) =>
      setFinanceForm({ ...financeForm, amount: e.target.value })
    }
    className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
  />
  </div>
  
</div>


                                       
                                       {/* Description */}
<div className="mt-6 flex justify-between items-start">
  <label className="block text-md font-medium pt-2">
    Description <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <Editor
      value={financeForm.description}
      onTextChange={(e) =>
        setFinanceForm({ ...financeForm, description: e.htmlValue })
      }
      style={{ height: "180px" }}
      className="border border-[#D9D9D9] rounded-lg"
    />
  </div>
</div>

{/* Upload Bill */}
<div className="mt-4 flex justify-between items-start">
  <label className="block text-md font-medium pt-2">
    Upload Bill <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) =>
        setFinanceForm({ ...financeForm, file: e.target.files[0] })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
    />
   
  </div>
</div>

{/* Status */}
{/* <div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Status <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
     <select
    value={financeForm.status}
    onChange={(e) =>
      setFinanceForm({ ...financeForm, status: e.target.value })
    }
    className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
  >
    <option value="">Select Status</option>
    <option value="Pending">Pending</option>
    <option value="Waiting for MD Approval">Waiting for MD Approval</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </select>
  </div>
 
</div>

{financeForm.status === "Pending" && (
  <div className="mt-4 flex justify-between items-center">
    <label className="block text-md font-medium">
      Upload Bill <span className="text-red-500">*</span>
    </label>
    <input
      type="file"
      onChange={(e) =>
        setFinanceForm({ ...financeForm, file: e.target.files[0] })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
    />
  </div>
)}

{financeForm.status === "Rejected" && (
  <div className="mt-4 flex justify-between items-center">
    <label className="block text-md font-medium">
      Rejection Notes <span className="text-red-500">*</span>
    </label>
    <div className="w-[50%] md:w-[60%]">
        <textarea
      rows="3"
      value={financeForm.notes}
      onChange={(e) =>
        setFinanceForm({ ...financeForm, notes: e.target.value })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg resize-none"
      placeholder="Enter rejection reason"
    />
    </div>
  </div>
)} */}

{/* Status (Read-only) */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Status <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <div
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg 
                  text-sm font-medium"
    >
      Pending
    </div>
  </div>
</div>






                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-10">
                                            <button
                                                onClick={closeAddModal}
                                                className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                disabled={submitting}
                                                onClick={handleCreateFinaceDetails}
                                                className="bg-[#1ea600] hover:bg-[#4BB452]
            text-white px-5 py-2 rounded-[10px]
            disabled:opacity-50"
                                            >
                                                {submitting ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Modal */}
                        {isEditModalOpen && (
                            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
                                <div className="absolute inset-0" onClick={closeEditModal}></div>

                                <div
                                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw]
        bg-white shadow-lg transform transition-transform duration-500 ease-in-out
        ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
                                >
                                    {/* Close Arrow */}
                                    <div
                                        className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                                        onClick={closeEditModal}
                                    >
                                        <IoIosArrowForward className="w-3 h-3" />
                                    </div>

                                    <div className="px-5 lg:px-14 py-4 md:py-10 text-[#4A4A4A] font-medium">
                                        <p className="text-xl md:text-2xl">Edit Finance </p>



                                       {/* Company */}
<div className="mt-5 flex justify-between items-center">
  <label className="block text-md font-medium">
    Company <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <Dropdown
  value={editFinanceForm.company}
  options={companyOptions}
  onChange={(e) =>
    setEditFinanceForm({ ...editFinanceForm, company: e.value })
  }
  placeholder="Select Company"
  className="w-full border border-gray-300 rounded-lg"
/>
  </div>
</div>

{/* Branch */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Branch <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <Dropdown
  value={editFinanceForm.branch}
  options={branchOptions}
  onChange={(e) =>
    setEditFinanceForm({ ...editFinanceForm, branch: e.value })
  }
  placeholder="Select Branch"
 className="w-full border border-gray-300 rounded-lg"
/>
  </div>
</div>


{/* Date */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Date <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <input
      type="date"
      value={editFinanceForm.date}
      onChange={(e) =>
        setEditFinanceForm({ ...editFinanceForm, date: e.target.value })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
    />
  </div>
</div>


{/* Amount */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Amount <span className="text-red-500">*</span>
  </label>
  <div className="w-[50%] md:w-[60%]">
    <input
    type="number"
    placeholder="Enter amount"
    value={editFinanceForm.amount}
    onChange={(e) =>
      setEditFinanceForm({ ...editFinanceForm, amount: e.target.value })
    }
    className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
  />
  </div>
  
</div>


                                       
                                       {/* Description */}
<div className="mt-6 flex justify-between items-start">
  <label className="block text-md font-medium pt-2">
    Description <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <Editor
      value={editFinanceForm.description}
      onTextChange={(e) =>
        setEditFinanceForm({ ...editFinanceForm, description: e.htmlValue })
      }
      style={{ height: "180px" }}
      className="border border-[#D9D9D9] rounded-lg"
    />
  </div>
</div>

{/* Upload Bill */}
<div className="mt-4 flex justify-between items-start">
  <label className="block text-md font-medium pt-2">
    Upload Bill <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) =>
       
        setEditFinanceForm({ ...editFinanceForm, file: e.target.files[0] })
      }
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg"
    />
   
  </div>
</div>

{/* Status (Read-only) */}
<div className="mt-4 flex justify-between items-center">
  <label className="block text-md font-medium">
    Status <span className="text-red-500">*</span>
  </label>

  <div className="w-[50%] md:w-[60%]">
    <div
      className="w-full px-3 py-2 border border-[#D9D9D9] rounded-lg 
                  text-sm font-medium"
    >
      Pending
    </div>
  </div>
</div>



                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-10">
                                            <button
                                                onClick={closeEditModal}
                                                className="border border-[#7C7C7C] text-[#7C7C7C]
            hover:bg-[#FEE2E2] hover:text-[#DC2626]
            px-5 py-2 rounded-[10px]"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                // onClick={handleUpdateWorkReport}
                                                className="bg-[#1ea600] hover:bg-[#4BB452]
            text-white px-5 py-2 rounded-[10px]"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </>
            )
            }
            <Footer />
        </div >
    );
};
export default Finace_Details;
